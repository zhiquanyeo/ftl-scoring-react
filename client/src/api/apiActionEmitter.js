import API from './socketApi';

import { tournamentInfoUpdated } from '../actions/matchActions';

const apiActionEmitter = (store) => {
    // Hook up API events that are not request/response pairs
    API.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
        console.log('received tournament info updated event');
        store.dispatch(tournamentInfoUpdated(tInfo));
    });
};

export default apiActionEmitter;