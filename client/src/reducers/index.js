import { combineReducers } from 'redux';
import matchInfo from './matchInfoReducer';
import currentMatch from './currentMatchReducer';
import teamList from './teamsReducer';
import system from './systemReducer';

// TODO change matchInfo to tournamentInfo
const rootReducer = combineReducers({
    matchInfo,
    currentMatch,
    teamList,
    system
});

export default rootReducer;