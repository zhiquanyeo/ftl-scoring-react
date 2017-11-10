const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const TournamentManager = require('./tournament-manager');

const tournamentManager = new TournamentManager();

io.on('connection', (socket) => {
    tournamentManager.registerClient(socket);
});

http.listen(3001, () => { console.log('Listening')});