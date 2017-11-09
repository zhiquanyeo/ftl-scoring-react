import { combineReducers } from 'redux';
import matchInfo from './matchInfoReducer';
import currentMatch from './currentMatchReducer';

// TODO change matchInfo to tournamentInfo
const rootReducer = combineReducers({
    matchInfo,
    currentMatch
});

export default rootReducer;