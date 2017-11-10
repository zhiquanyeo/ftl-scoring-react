const EventEmitter = require('events');
const Moniker = require('moniker');

function buildResponse(req) {
    return {
        messageId: req.messageId,
        err: null,
        payload: null
    };
}

function buildTournamentInfo(activeMatch, matchList) {
    return {
        activeMatch: activeMatch,
        matchList: matchList
    };
}

class TournamentManager extends EventEmitter {
    constructor() {
        super();

        // Keep track of sockets
        this.d_clients = [];

        // Tournament info
        this.d_teams = {};
        this.d_matches = [];
        this.d_matchNameMap = {}; // really a set of names
        this.d_activeMatch = null;
        this.d_currentMatchScore = null;
        // Immediately init the score
        this.resetCurrentMatchScore();
    }

    /**
     * Pre-populates the teams and matches, and updates all clients
     * @param {*} teamMap 
     * @param {*} matchList 
     */
    populate(teamMap, matchList) {
        this.d_teams = teamMap;
        this.d_matches = matchList;
        this.d_matchNameMap = {};
        for (var i = 0; i < matchList.length; i++) {
            this.d_matchNameMap[matchList[i].matchName] = true;
        }

        this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
        this.broadcast('TEAM_LIST_UPDATED', this.d_teams);
    }

    resetCurrentMatchScore() {
        this.d_currentMatchScore = {
            matchName: null,
            points: {
                red: {
                    auto: 0,
                    teleop: 0,
                    others: 0,
                    fouls: 0,
                    techFouls: 0,
                    autoBreakdown: [
                        { baseline: false, penalty: false, goal: false },
                        { baseline: false, penalty: false, goal: false },
                    ]
                },
                blue: {
                    auto: 0,
                    teleop: 0,
                    others: 0,
                    fouls: 0,
                    techFouls: 0,
                    autoBreakdown: [
                        { baseline: false, penalty: false, goal: false },
                        { baseline: false, penalty: false, goal: false },
                    ]
                }
            }
        };
    }

    registerClient (socket) {
        this.d_clients.push(socket);

        // Hook up to all the events
        // General Request message
        socket.on('request', this.handleRequest.bind(this, socket));

        var id = Moniker.choose();

        socket.emit('REGISTRATION', id);

        // Send the new clients a status update
        socket.emit('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
        socket.emit('TEAM_LIST_UPDATED', this.d_teams);
        socket.emit('CURRENT_MATCH_POINTS_UPDATED', this.d_currentMatchScore);
    }

    unregisterClient (socket) {
        for (var i = 0; i < this.d_clients.length; i++) {
            if (this.d_clients[i] === socket) {
                this.d_clients.splice(i, 1);
                return;
            }
        }
    }

    broadcast(evt, data) {
        for (var i = 0; i < this.d_clients.length; i++) {
            this.d_clients[i].emit(evt, data);
        }
    }

    // Event handlers
    handleRequest(socket, req) {
        // All requests have the form { channel, messageId, payload } and require a response
        // All sub handlers should return a suitable response of the form { messageId, err, payload }
        var resp;
        switch (req.channel) {
            case 'ADD_MATCH': {
                resp = this.handleAddMatch(req, socket);
            } break;
            case 'DELETE_MATCH': {
                resp = this.handleDeleteMatch(req, socket);
            } break;
            case 'SET_ACTIVE_MATCH': {
                resp = this.handleSetActiveMatch(req, socket);
                console.log('set active match resp: ', resp);
            } break;
            case 'UPDATE_AUTO_POINTS': {
                resp = this.handleUpdateAutoPoints(req, socket);
            } break;
            case 'ADD_TELEOP_POINTS': {
                resp = this.handleAddTeleopPoints(req, socket);
            } break;
            case 'ADD_ADJUSTMENT_POINTS': {
                resp = this.handleAddAdjustmentPoints(req, socket);
            } break;
            case 'ADD_TEAM': {
                resp = this.handleAddTeam(req, socket);
            } break;
            case 'DELETE_TEAM': {
                resp = this.handleDeleteTeam(req, socket);
            } break;
            case 'START_MATCH_MODE': {
                resp = this.handleStartMatchMode(req, socket);
            } break;
            case 'COMMIT_SCORE': {
                resp = this.handleCommitScore(req, socket);
            } break;
        }

        socket.emit('response', resp);
    }

    // Tournament data handlers
    handleAddMatch(req, socket) {
        var resp = buildResponse(req);

        if (this.d_matchNameMap[req.payload.matchName]) {
            resp.err = "Match '" + req.payload.matchName + "' already exists";
        }
        else {
            // TODO Verify that the teams exist
            var redTeams = req.payload.redTeams;
            var blueTeams = req.payload.blueTeams;

            var redTeamNames = [];
            var blueTeamNames = [];

            var err = false;
            for (var i = 0; i < redTeams.length; i++) {
                var teamId = redTeams[i].trim();
                if (!this.d_teams[teamId]) {
                    err = true;
                    redTeamNames.push('INVALID TEAM');
                }
                else {
                    redTeamNames.push(this.d_teams[teamId]);
                }
            }
            for (var i = 0; i < blueTeams.length; i++) {
                var teamId = blueTeams[i].trim();
                if (!this.d_teams[teamId]) {
                    err = true;
                    blueTeamNames.push('INVALID TEAM');
                }
                else {
                    blueTeamNames.push(this.d_teams[teamId]);
                }
            }

            if (err) {
                resp.err = "Invalid Teams found";
            }
            else {
                var matchObj = {
                    matchName: req.payload.matchName,
                    redTeams: redTeamNames,
                    blueTeams: blueTeamNames,
                    scores: {
                        red: {
                            auto: 0,
                            teleop: 0,
                            others: 0,
                            fouls: 0,
                            techFouls: 0
                        },
                        blue: {
                            auto: 0,
                            teleop: 0,
                            others: 0,
                            fouls: 0,
                            techFouls: 0
                        }
                    },
                    state: 'PRE_START',
                    shouldScore: req.payload.shouldScore
                }
                console.log('should score? ', req.payload.shouldScore);
                this.d_matches.push(matchObj);
                this.d_matchNameMap[req.payload.matchName] = true;

                // Emit an event so that the main file can persist this to DB
                this.emit('addMatch', matchObj, redTeams, blueTeams);
            }
        }

        resp.payload = buildTournamentInfo(this.d_activeMatch, this.d_matches);

        // Tell the other sockets (not us)
        socket.broadcast.emit('TOURNAMENT_INFO_UPDATED', resp.payload);

        return resp;
    }

    handleDeleteMatch(req, socket) {
        var resp = buildResponse(req);

        if (!this.d_matchNameMap[req.payload.matchName]) {
            resp.err("Invalid match name specified '" + req.payload.matchName + "'");
        }
        else {
            delete this.d_matchNameMap[req.payload.matchName];
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    this.d_matches.splice(i, 1);
                    break;
                }
            }

            this.emit('deleteMatch', req.payload.matchName);
        }

        resp.payload = buildTournamentInfo(this.d_activeMatch, this.d_matches);

        socket.broadcast.emit('TOURNAMENT_INFO_UPDATED', resp.payload);

        return resp;
    }

    handleSetActiveMatch(req, socket) {
        var resp = buildResponse(req);
        
        // Make sure this is a legit match
        if (this.d_activeMatch !== req.payload.matchName) {
            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                    break;
                }
            }

            if (!matchInfo) {
                resp.err = "Invalid match name provided '" + req.payload.matchName + "'";
            }
            else {
                // Make sure the current match is not yet started
                if (matchInfo.state !== 'PRE_START') {
                    resp.err = "Match '" + req.payload.matchName + "' has already been started";
                }
                else {
                    // All good
                    this.d_activeMatch = req.payload.matchName;
                    // also reset current match scores
                    this.resetCurrentMatchScore();
                    this.d_currentMatchScore.matchName = this.d_activeMatch;
                }
            }
        }
        resp.payload = buildTournamentInfo(this.d_activeMatch, this.d_matches);

        // Tell the other sockets (not us)
        socket.broadcast.emit('TOURNAMENT_INFO_UPDATED', resp.payload);

        return resp;
    }

    handleAddTeam(req, socket) {
        var resp = buildResponse(req);

        if (this.d_teams[req.payload.id]) {
            resp.err = "Team ID '" + req.payload.id + "' already exists";
        }
        else {
            this.d_teams[req.payload.id] = req.payload.name;
            this.emit('addTeam', {
                id: req.payload.id,
                name: req.payload.name
            });
        }

        resp.payload = this.d_teams;

        // Tell the other sockets (not us)
        socket.broadcast.emit('TEAM_LIST_UPDATED', resp.payload);

        return resp;
    }

    handleDeleteTeam(req, socket) {
        var resp = buildResponse(req);

        delete this.d_teams[req.payload.id];
        this.emit('deleteTeam', req.payload.id);

        resp.payload = this.d_teams;

        // Tell the other sockets (not us)
        socket.broadcast.emit('TEAM_LIST_UPDATED', resp.payload);

        return resp;
    }

    handleUpdateAutoPoints(req, socket) {
        var resp = buildResponse(req);
        // build the points per side
        // baseline = 1, penalty = 3, goal = 5
        // verify that the match name is correct
        var side = req.payload.side;
        if (!req.payload.matchName) {
            resp.err = "No match selected";
        }
        else if (req.payload.matchName !== this.d_activeMatch) {
            resp.err = "Scoring request received for incorrect match '" + req.payload.matchName + "'";
        }
        else if (side !== 'red' && side !== 'blue') {
            resp.err = "Invalid side '" + req.payload.side + "'";
        }
        else {
            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                    break;
                }
            }

            // We only care about the sides
            var pointVal = 0;
            for (var i = 0; i < req.payload.points.length; i++) {
                var pointEntry = req.payload.points[i];
                pointVal += (pointEntry.baseline ? 1 : 0) +
                            (pointEntry.penalty ? 3 : 0) +
                            (pointEntry.goal ? 5: 0);
            }

            // Update the current match score
            this.d_currentMatchScore.points[side].auto = pointVal;
            this.d_currentMatchScore.points[side].autoBreakdown = req.payload.points;

            // Also update the corresponding entry in the main match list
            if (matchInfo) {
                matchInfo.scores[side].auto = pointVal;
            }
        }

        // Build the payload, which is a score object
        resp.payload = this.d_currentMatchScore;

        // Broadcast
        socket.broadcast.emit('CURRENT_MATCH_POINTS_UPDATED', resp.payload);

        // Also send tournament update
        this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));

        // Also send the auto points stuff
        socket.broadcast.emit('CURRENT_MATCH_AUTO_POINTS_UPDATED', {
            matchName: this.d_currentMatchScore.matchName,
            points: {
                red: this.d_currentMatchScore.points.red.autoBreakdown,
                blue: this.d_currentMatchScore.points.blue.autoBreakdown
            }
        });
        return resp;
    }

    handleAddTeleopPoints(req, socket) {
        var resp = buildResponse(req);

        var side = req.payload.side;
        if (!req.payload.matchName) {
            resp.err = "No match selected";
        }
        else if (req.payload.matchName !== this.d_activeMatch) {
            resp.err = "Scoring request received for incorrect match '" + req.payload.matchName + "'";
        }
        else if (side !== 'red' && side !== 'blue') {
            resp.err = "Invalid side '" + req.payload.side + "'";
        }
        else {
            // type and points
            var currTypeScore = this.d_currentMatchScore.points[side][req.payload.type];
            currTypeScore += req.payload.points;
            this.d_currentMatchScore.points[side][req.payload.type] = currTypeScore;

            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                    break;
                }
            }

            if (matchInfo) {
                matchInfo.scores[side][req.payload.type] = currTypeScore;
            }
        }

        resp.payload = this.d_currentMatchScore;

        socket.broadcast.emit('CURRENT_MATCH_POINTS_UPDATED', resp.payload);
        this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));

        return resp;
    }

    handleAddAdjustmentPoints(req, socket) {
        var resp = buildResponse(req);
        
        var side = req.payload.side;
        if (!req.payload.matchName) {
            resp.err = "No match selected";
        }
        else if (req.payload.matchName !== this.d_activeMatch) {
            resp.err = "Scoring request received for incorrect match '" + req.payload.matchName + "'";
        }
        else if (side !== 'red' && side !== 'blue') {
            resp.err = "Invalid side '" + req.payload.side + "'";
        }
        else {
            var currOthersScore = this.d_currentMatchScore.points[side].others;
            currOthersScore += req.payload.points;
            this.d_currentMatchScore.points[side].others = currOthersScore;
            
            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                    break;
                }
            }

            if (matchInfo) {
                matchInfo.scores[side].others = currOthersScore;
            }
        }

        resp.payload = this.d_currentMatchScore;

        socket.broadcast.emit('CURRENT_MATCH_POINTS_UPDATED', resp.payload);
        this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));

        return resp;
    }

    handleCommitScore(req, socket) {
        var resp = buildResponse(req);
        // Get the match scores and write them to the DB
        if (!req.payload.matchName) {
            resp.err = "No match selected";
        }
        else {
            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                    break;
                }
            }

            if (matchInfo) {
                this.emit('commitScores', matchInfo);
            }
        }

        return resp;
    }

    handleStartMatchMode(req, socket) {
        var resp = buildResponse(req);
        
        if (!req.payload.matchName) {
            resp.err = "No match selected";
        }
        else if (req.payload.matchName !== this.d_activeMatch) {
            resp.err = "Scoring request received for incorrect match '" + req.payload.matchName + "'";
        }
        else {
            var matchInfo;
            for (var i = 0; i < this.d_matches.length; i++) {
                if (this.d_matches[i].matchName === req.payload.matchName) {
                    matchInfo = this.d_matches[i];
                }
            }

            if (!matchInfo) {
                resp.err = "Invalid match name provided '" + req.payload.matchName + "'";
            }
            else {
                // OK
                // Update the current state
                if (req.payload.mode === 'auto') {
                    console.log('Match ' + matchInfo.matchName + ' starting AUTO');
                    // Start autonomous mode
                    matchInfo.state = 'AUTO';
                    
                    // Start the timer
                    var currTime = Date.now();
                    var autoInterval = setInterval(() => {
                        var nowTime = Date.now();
                        var timeElapsedSec = Math.floor((nowTime - currTime) / 1000);
                        var timeRemaining = 210 - timeElapsedSec; // this is what we send down
                        
                        this.broadcast('CURRENT_MATCH_TIME_REMAINING_UPDATED', {
                            matchName: matchInfo.matchName,
                            timeRemaining: timeRemaining
                        });
                        if (timeElapsedSec >= 30) {
                            clearInterval(autoInterval);
                            matchInfo.state = 'AUTO_COMPLETE';
                            this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
                            this.broadcast('CURRENT_MATCH_TIME_REMAINING_UPDATED', {
                                matchName: matchInfo.matchName,
                                timeRemaining: 180
                            });

                            console.log('AUTO complete');
                        }
                    }, 250);

                    resp.payload = {
                        matchName: matchInfo.matchName,
                        timeRemaining: 210
                    };
                }
                else if (req.payload.mode === 'teleop') {
                    matchInfo.state = 'TELEOP';

                    console.log('Match ' + matchInfo.matchName + ' starting TELEOP');

                    var currTime = Date.now();
                    var teleopInterval = setInterval(() => {
                        var nowTime = Date.now();
                        var timeElapsedSec = Math.floor((nowTime - currTime) / 1000);
                        var timeRemaining = 180 - timeElapsedSec; // this is what we send down
                        
                        this.broadcast('CURRENT_MATCH_TIME_REMAINING_UPDATED', {
                            matchName: matchInfo.matchName,
                            timeRemaining: timeRemaining
                        });
                        if (timeElapsedSec >= 180) {
                            clearInterval(teleopInterval);
                            matchInfo.state = 'COMPLETE';
                            this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
                            this.broadcast('CURRENT_MATCH_TIME_REMAINING_UPDATED', {
                                matchName: matchInfo.matchName,
                                timeRemaining: 0
                            });
                            console.log('TELEOP complete');
                        }
                    }, 250);

                    resp.payload = {
                        matchName: matchInfo.matchName,
                        timeRemaining: 180
                    };
                }

                // Update tournament info
                this.broadcast('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
            }
        }
        return resp;
    }
};

module.exports = TournamentManager;