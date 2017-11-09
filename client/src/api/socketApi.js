import Promise from 'promise';
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
        this.socket.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
            this.emit('TOURNAMENT_INFO_UPDATED', tInfo);
        })
    }

    send(topic, id, channel, data) {
        var respData = {};
        
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