const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Sequelize = require('sequelize');
var sequelize;

var env = process.env.NODE_ENV || "development";
if (env === "production") {
    sequelize = new Sequelize(process.env.DATABASE_URL);
}
else {
    sequelize = new Sequelize("ftldb", null, null, {
        dialect: 'sqlite',
        storage: './test.sqlite'
    });
}

const Team = sequelize.define('team', {
    id: {type: Sequelize.STRING, primaryKey: true},
    name: Sequelize.STRING
});

const Match = sequelize.define('match', {
    id: {type: Sequelize.STRING, primaryKey: true},
    state: Sequelize.STRING,
    redAutoScore: Sequelize.INTEGER,
    redTeleopScore: Sequelize.INTEGER,
    redOthersScore: Sequelize.INTEGER,
    redFouls: Sequelize.INTEGER,
    redTechFouls: Sequelize.INTEGER,
    blueAutoScore: Sequelize.INTEGER,
    blueTeleopScore: Sequelize.INTEGER,
    blueOthersScore: Sequelize.INTEGER,
    blueFouls: Sequelize.INTEGER,
    blueTechFouls: Sequelize.INTEGER
});

const MatchRole = sequelize.define('matchRole', {
    team_id: {
        type: Sequelize.STRING,
        references: {
            model: Team,
            key: 'id'
        }
    },
    match_id: {
        type: Sequelize.STRING,
        references: {
            model: Match,
            key: 'id'
        }
    },
    side: Sequelize.STRING,
    position: Sequelize.INTEGER
});

var serverPort = process.env.PORT || 3001;

// Set up the server port
app.set('port', serverPort);

const TournamentManager = require('./tournament-manager');

const tournamentManager = new TournamentManager();

io.on('connection', (socket) => {
    tournamentManager.registerClient(socket);
});

console.log('=== Connecting to Database ===');
sequelize
.authenticate()
.then(() => {
    sequelize.sync().then(() => {
        // Extract the data we need first, then build state and sync with the DB
        var teamList = {};
        var matchList = [];
        var matchMap = {};
        var matchRolesMap = {};

        Promise.all([Team.findAll(), Match.findAll(), MatchRole.findAll()])
        .then((values) => {
            var teams = values[0];
            var matches = values[1];
            var matchRoles = values[2];
            
            for (var i = 0; i < teams.length; i++) {
                var teamInfo = teams[i].dataValues;
                teamList[teamInfo.id] = teamInfo.name;
            }

            for (var i = 0; i < matchRoles.length; i++) {
                var matchRoleInfo = matchRoles[i].dataValues;
                // Key by matchID
                if (!matchRolesMap[matchRoleInfo.match_id]) {
                    matchRolesMap[matchRoleInfo.match_id] = {
                        red: [],
                        blue: []
                    };
                }

                var teamArray = matchRolesMap[matchRoleInfo.match_id][matchRoleInfo.side];
                if (teamArray) {
                    // verify that position is 0 or 1
                    if (matchRoleInfo.position === 0 ||
                        matchRoleInfo.position === 1) {
                            
                        teamArray[matchRoleInfo.position] = matchRoleInfo.team_id;
                    }
                }
            }

            for (var i = 0; i < matches.length; i++) {
                var matchInfo = matches[i].dataValues;
                // Re-write the object in a form that we can use
                var matchObj = {
                    matchName: matchInfo.id,
                    state: matchInfo.state,
                    scores: {
                        red: {
                            auto: matchInfo.redAutoScore,
                            teleop: matchInfo.redTeleopScore,
                            others: matchInfo.redOthersScore,
                            fouls: matchInfo.redFouls,
                            techFouls: matchInfo.redTechFouls
                        },
                        blue: {
                            auto: matchInfo.blueAutoScore,
                            teleop: matchInfo.blueTeleopScore,
                            others: matchInfo.blueOthersScore,
                            fouls: matchInfo.blueFouls,
                            techFouls: matchInfo.blueTechFouls
                        }
                    },
                    redTeams: ['EMPTY', 'EMPTY'],
                    blueTeams: ['EMPTY', 'EMPTY']
                };

                // Match the teams!
                var matchTeamList = matchRolesMap[matchInfo.id];
                if (matchTeamList) {
                    // red
                    if (matchTeamList.red[0]) {
                        matchObj.redTeams[0] = teamList[matchTeamList.red[0]] || 'EMPTY';
                    }
                    if (matchTeamList.red[1]) {
                        matchObj.redTeams[1] = teamList[matchTeamList.red[1]] || 'EMPTY';
                    }

                    //blue
                    if (matchTeamList.blue[0]) {
                        matchObj.blueTeams[0] = teamList[matchTeamList.blue[0]] || 'EMPTY';
                    }
                    if (matchTeamList.blue[1]) {
                        matchObj.blueTeams[1] = teamList[matchTeamList.blue[1]] || 'EMPTY';
                    }
                }

                matchList.push(matchObj);
            }

            // Populate the tournament manager
            console.log('Populating Tournament Manager');
            tournamentManager.populate(teamList, matchList);
        })
        .catch((err) => {
            console.error('Error while getting initial data: ', err);
        })
        
        console.log('Models Synced to DB. Starting up server...');
        http.listen(app.get('port'), () => {
            console.log('Server listening on *:' + app.get('port'));
        })
        
    });
})
.catch((err) => {
    console.error("Unable to connect: ", err);
})