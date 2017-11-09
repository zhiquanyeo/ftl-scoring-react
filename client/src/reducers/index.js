import { combineReducers } from 'redux';
import matchInfo from './matchInfoReducer';
import currentMatch from './currentMatchReducer';
import teamList from './teamsReducer';

// TODO change matchInfo to tournamentInfo
const rootReducer = combineReducers({
    matchInfo,
    currentMatch,
    teamList
});

export default rootReducer;