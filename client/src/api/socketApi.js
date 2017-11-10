import ee from 'event-emitter';
import IO from 'socket.io-client';

class API {
    constructor() {
        // This should get changed when in prod
        this.socket = IO.connect('http://localhost:3001');

        this.socket.on('response', (resp) => {
            // resp is { messageId, err, payload }
            // Forward the response along
            this.emit('response', resp, resp.messageId, resp.err, resp.payload);
        });

        // Out of band comms
        this.socket.on('REGISTRATION', (id) => {
            this.emit('REGISTRATION', id);
        });

        this.socket.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
            this.emit('TOURNAMENT_INFO_UPDATED', tInfo);
        });

        this.socket.on('TEAM_LIST_UPDATED', (teamList) => {
            this.emit('TEAM_LIST_UPDATED', teamList);
        });

        this.socket.on('CURRENT_MATCH_POINTS_UPDATED', (scores) => {
            this.emit('CURRENT_MATCH_POINTS_UPDATED', scores);
        });

        this.socket.on('CURRENT_MATCH_AUTO_POINTS_UPDATED', (scores) => {
            this.emit('CURRENT_MATCH_AUTO_POINTS_UPDATED', scores);
        });

        this.socket.on('CURRENT_MATCH_TIME_REMAINING_UPDATED', (tInfo) => {
            this.emit('CURRENT_MATCH_TIME_REMAINING_UPDATED', tInfo);
        })
    }

    send(topic, id, channel, data) {
        this.socket.emit(topic, {
            channel: channel,
            messageId: id,
            payload: data.payload
        });
        
    }
}

ee(API.prototype);

const APIInstance = new API();

export default APIInstance;