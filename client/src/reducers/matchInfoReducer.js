import { ADD_MATCH, DELETE_MATCH, SET_ACTIVE_MATCH, TOURNAMENT_INFO_UPDATED } from '../actions/matchActions';

const initialState = {
    activeMatch: null,
    matchList: [],
};

export default(state = initialState, action) => {
    const { type, payload } = action;

    // TODO These should really get sent back to the server, and react to a REFRESH_TOURNAMENT_INFO
    switch (type) {
        case ADD_MATCH:
            return {
                ...state,
                matchList: [...state.matchList, payload]
            }
        case DELETE_MATCH:
            var newMatchList = [...state.matchList];
            for (var i = 0; i < newMatchList.length; i++) {
                if (newMatchList[i].matchName === payload.matchName) {
                    newMatchList.splice(i, 1);
                    break;
                }
            }
            return {
                ...state,
                matchList: newMatchList
            };
        case SET_ACTIVE_MATCH:
            return {
                activeMatch: payload.matchName,
                ...state
            }
        case TOURNAMENT_INFO_UPDATED:
            return {
                activeMatch: payload.tournamentInfo.activeMatch,
                matchList: payload.tournamentInfo.matchList
            }
        default: {
            return state;
        }
    }
}