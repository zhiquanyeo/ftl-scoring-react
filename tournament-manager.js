const EventEmitter = require('events');

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
                        { baseline: 0, penalty: 0, goal: 0 },
                        { baseline: 0, penalty: 0, goal: 0 },
                    ]
                },
                blue: {
                    auto: 0,
                    teleop: 0,
                    others: 0,
                    fouls: 0,
                    techFouls: 0,
                    autoBreakdown: [
                        { baseline: 0, penalty: 0, goal: 0 },
                        { baseline: 0, penalty: 0, goal: 0 },
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

        // Send the new clients a status update
        socket.emit('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
        socket.emit('TEAM_LIST_UPDATED', this.d_teams);
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
            case 'SET_ACTIVE_MATCH': {
                resp = this.handleSetActiveMatch(req, socket);
            } break;
            case 'UPDATE_AUTO_POINTS': {
                resp = this.handleUpdateAutoPoints(req, socket);
            } break;
            case 'ADD_TELEOP_POINTS': {
                resp = this.handleAddTeleopPoints(req, socket);
            } break;
            case 'ADD_TEAM': {
                resp = this.handleAddTeam(req, socket);
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
            this.d_matches.push(req.payload);
            this.d_matchNameMap[req.payload.matchName] = true;
        }

        resp.payload = buildTournamentInfo(this.d_activeMatch, this.d_matches);

        // Tell the other sockets (not us)
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
                }
            }

            if (!matchInfo) {
                resp.err = "Invalid match name provided '" + req.payload.matchName + "'";
            }
            else {
                console.log('matchinfo ', matchInfo);
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
        }

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
        if (req.payload.matchName !== this.d_activeMatch.matchName) {
            resp.err = "Scoring request received for incorrect match '" + req.payload.matchName + "'";
        }
        else if (side !== 'red' && side !== 'blue') {
            resp.err = "Invalid side '" + req.payload.side + "'";
        }
        else {
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

        }

        // Build the payload, which is a score object
        resp.payload = this.d_currentMatchScore;

        // Broadcast
        socket.broadcast.emit('CURRENT_MATCH_POINTS_UPDATED', resp.payload);

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

        return resp;
    }
};

module.exports = TournamentManager;