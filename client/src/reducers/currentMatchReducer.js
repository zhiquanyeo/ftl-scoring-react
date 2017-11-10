import { CURRENT_MATCH_POINTS_UPDATED, CURRENT_MATCH_AUTO_POINTS_UPDATED, UPDATE_AUTO_POINTS, ADD_TELEOP_POINTS} from '../actions/currentMatchActions';

const initialState = {
    matchName: null,
    points: {
        red: {
            auto: 0,
            teleop: 0,
            others: 0,
            fouls: 0,
            techFouls: 0,
            autoBreakdown: [
                { baseline: 0, penalty: 0, goal: 0 },
                { baseline: 0, penalty: 0, goal: 0 },
            ]
        },
        blue: {
            auto: 0,
            teleop: 0,
            others: 0,
            fouls: 0,
            techFouls: 0,
            autoBreakdown: [
                { baseline: 0, penalty: 0, goal: 0 },
                { baseline: 0, penalty: 0, goal: 0 },
            ]
        }
    }
};

export default(state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_AUTO_POINTS: 
            console.log('UPDATE_AUTO_POINTS: ', payload);
            return state;
        case ADD_TELEOP_POINTS:
            console.log('ADD_TELEOP_POINTS: ', payload);
            return state;
        case CURRENT_MATCH_POINTS_UPDATED:
            return {
                ...state,
                points: payload.points
            }
        // Probably don't need this one
        case CURRENT_MATCH_AUTO_POINTS_UPDATED:
            console.log('CURRENT_MATCH_AUTO_POINTS_UPDATED: ', payload);
            return state;
        default: 
            return state;
    }
};