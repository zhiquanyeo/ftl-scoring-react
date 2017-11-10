import { CURRENT_MATCH_TIME_REMAINING_UPDATED } from '../actions/currentMatchActions';

const initialState = {
    timeRemaining: 0
};

export default(state = initialState, action) => {
    const {type, payload} = action;

    switch (type) {
        case CURRENT_MATCH_TIME_REMAINING_UPDATED:
            return {
                timeRemaining: payload.timeRemaining
            }
        default: 
            return state;
    }
};