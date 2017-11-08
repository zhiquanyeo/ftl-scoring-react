import Promise from 'promise';
import ee from 'event-emitter';

class API {
    constructor() {
        this.socket = null;
        
        // All fake data!
        this.tournamentInfo = {
            activeMatch: 'Test',
            matchList: [],
        }
    }

    send(topic, id, channel, data) {
        var respData = {};
        if (channel === 'ADD_MATCH') {
            this.tournamentInfo.matchList.push(data.payload)
            respData = this.tournamentInfo;
        }
        setTimeout(() => {
            this.emit('response', {}, id, null, respData);
        }, 1000)
        
    }
}

ee(API.prototype);

const APIInstance = new API();

export default APIInstance;