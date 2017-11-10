import { combineReducers } from 'redux';
import matchInfo from './matchInfoReducer';
import currentMatch from './currentMatchReducer';
import teamList from './teamsReducer';
import system from './systemReducer';
import currentMatchTime from './matchTimeReducer';

// TODO change matchInfo to tournamentInfo
const rootReducer = combineReducers({
    matchInfo,
    currentMatch,
    teamList,
    system,
    currentMatchTime
});

export default rootReducer;