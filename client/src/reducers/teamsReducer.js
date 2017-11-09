import { TEAM_LIST_UPDATED } from '../actions/teamActions';

const initialState = {
    teams: []
};

export default(state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case TEAM_LIST_UPDATED:
            return {
                teams: payload.teamList
            }
        default:
            return state;
    }
};