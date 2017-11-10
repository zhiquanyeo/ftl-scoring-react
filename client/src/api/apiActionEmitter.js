import API from './socketApi';

import { tournamentInfoUpdated } from '../actions/matchActions';
import { currentMatchPointsUpdated, currentMatchAutoPointsUpdated } from '../actions/currentMatchActions';
import { teamListUpdated } from '../actions/teamActions';
import { registration } from '../actions/systemActions';

const apiActionEmitter = (store) => {
    // Hook up API events that are not request/response pairs
    API.on('TOURNAMENT_INFO_UPDATED', (tInfo) => {
        store.dispatch(tournamentInfoUpdated(tInfo));
    });

    API.on('REGISTRATION', (id) => {
        store.dispatch(registration(id));
    });

    // TODO We could theoretically make these subscription based?
    API.on('CURRENT_MATCH_POINTS_UPDATED', (matchPoints) => {
        store.dispatch(currentMatchPointsUpdated(matchPoints.matchName, matchPoints.points));
    });

    API.on('CURRENT_MATCH_AUTO_POINTS_UPDATED', (autoPoints) => {
        store.dispatch(currentMatchAutoPointsUpdated(autoPoints.matchName, autoPoints.points));
    });

    API.on('TEAM_LIST_UPDATED', (teamList) => {
        store.dispatch(teamListUpdated(teamList));
    });
};

export default apiActionEmitter;