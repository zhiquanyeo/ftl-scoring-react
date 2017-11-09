import API from './socketApi';

import { tournamentInfoUpdated } from '../actions/matchActions';
import { currentMatchPointsUpdated } from '../actions/currentMatchActions';
import { teamListUpdated } from '../actions/teamActions';

const apiActionEmitter = (store) => {
    // Hook up API events that are not request/response pairs
    API.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
        console.log('received tournament info updated event', tInfo);
        store.dispatch(tournamentInfoUpdated(tInfo));
    });

    // TODO We could theoretically make these subscription based?
    API.on('CURRENT_MATCH_POINTS_UPDATED', (matchPoints) => {
        console.log('received match updates: ', matchPoints);
    });

    API.on('CURRENT_MATCH_AUTO_POINTS_UPDATED', (autoPoints) => {
        console.log('received auto point update', autoPoints);
    });

    API.on('TEAM_LIST_UPDATED', (teamList) => {
        console.log('received team list', teamList);
        store.dispatch(teamListUpdated(teamList));
    })
};

export default apiActionEmitter;