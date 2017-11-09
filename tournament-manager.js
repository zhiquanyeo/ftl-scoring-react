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
    }

    registerClient (socket) {
        this.d_clients.push(socket);

        // Hook up to all the events
        // General Request message
        socket.on('request', this.handleRequest.bind(this, socket));

        // Send the new clients a status update
        socket.emit('TOURNAMENT_INFO_UPDATED', buildTournamentInfo(this.d_activeMatch, this.d_matches));
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
            }
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
        console.log('handle set active match: ', req);
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
                }
            }
        }
        resp.payload = buildTournamentInfo(this.d_activeMatch, this.d_matches);

        // Tell the other sockets (not us)
        socket.broadcast.emit('TOURNAMENT_INFO_UPDATED', resp.payload);

        return resp;
    }
};

module.exports = TournamentManager;