import API from './socketApi';

import { tournamentInfoUpdated } from '../actions/matchActions';
import { currentMatchPointsUpdated } from '../actions/currentMatchActions';

const apiActionEmitter = (store) => {
    // Hook up API events that are not request/response pairs
    API.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
        console.log('received tournament info updated event');
        store.dispatch(tournamentInfoUpdated(tInfo));
    });

    // TODO We could theoretically make these subscription based?
    API.on('CURRENT_MATCH_POINTS_UPDATED', (matchPoints) => {
        console.log('received match updates: ', matchPoints);
    });

    API.on('CURRENT_MATCH_AUTO_POINTS_UPDATED', (autoPoints) => {
        console.log('received auto point update', autoPoints);
    })
};

export default apiActionEmitter;