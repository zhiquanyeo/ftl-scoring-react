import { combineReducers } from 'redux';
import matchInfo from './matchInfoReducer';

const rootReducer = combineReducers({
    matchInfo
});

export default rootReducer;