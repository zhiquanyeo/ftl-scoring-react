import request from '../api/Request';

// Action for CurrMatchPointsUpdated
export const CURRENT_MATCH_POINTS_UPDATED = 'CURRENT_MATCH_POINTS_UPDATED';
export const currentMatchPointsUpdated = (matchName, points) => {
    // Where points has 2 keys, red and blue, each with:
    // { auto, teleop, others, fouls, techFouls, autoBreakdown: [] }

    // Destructure the points object
    return {
        type: CURRENT_MATCH_POINTS_UPDATED,
        payload: {
            matchName: matchName,
            points: points
        }
    };
};

// Update for Auto scorers
export const CURRENT_MATCH_AUTO_POINTS_UPDATED = 'CURRENT_MATCH_AUTO_POINTS_UPDATED';
export const currentMatchAutoPointsUpdated = (matchName, autoPointObj) => {
    // where autoPointObj is red/blue with array of { goal, baseline, penalty }
    return {
        type: CURRENT_MATCH_AUTO_POINTS_UPDATED,
        payload: {
            matchName: matchName,
            points: autoPointObj
        }
    };
}

// Update Auto points (this can keep changing up till end of match)
// triggers both a CURRENT_MATCH_POINTS_UPDATED and AUTO_POINTS_UPDATED
export const UPDATE_AUTO_POINTS = 'UPDATE_AUTO_POINTS';
const _updateAutoPoints = (matchName, side, points, reporter) => {
    // pointObj = array of { baseline, goal, penalty }
    // TODO make this more extensible in future
    return {
        type: UPDATE_AUTO_POINTS,
        payload: {
            matchName: matchName,
            side: side,
            points: points,
            reporter: reporter
        }
    };
};
export const updateAutoPoints = (matchName, side, points, reporter) => {
    return (dispatch, getState) => {
        request(_updateAutoPoints(matchName, side, points))
        .then((resp) => {
            // Return value is a CurrMatchPoints struct
            dispatch(currentMatchPointsUpdated(resp.matchName, resp.points));
        })
    }
}


// Handle points during teleop, including fouls etc
export const ADD_TELEOP_POINTS = 'ADD_TELEOP_POINTS';
const _addTeleopPoints = (matchName, side, type, points, reporter) => {
    return {
        type: ADD_TELEOP_POINTS,
        payload: {
            matchName: matchName,
            side: side,
            type: type,
            points: points,
            reporter: reporter
        }
    };
}
export const addTeleopPoints = (matchName, side, type, points, reporter) => {
    return (dispatch, getState) => {
        request(_addTeleopPoints(matchName, side, type, points, reporter))
        .then((resp) => {
            // Return value is a CurrMatchPoints struct
            dispatch(currentMatchPointsUpdated(resp.matchName, resp.points));
        });
    }
}

export const CURRENT_MATCH_TIME_REMAINING_UPDATED = 'CURRENT_MATCH_TIME_REMAINING_UPDATED';
export const currentMatchTimeRemainingUpdated = (matchName, timeRemaining) => {
    return {
        type: CURRENT_MATCH_TIME_REMAINING_UPDATED,
        payload: {
            timeRemaining: timeRemaining
        }
    };
}

// Start auto mode
export const START_MATCH_MODE = 'START_MATCH_MODE';
const _startMatchMode = (matchName, mode) => {
    return {
        type: START_MATCH_MODE,
        payload: {
            matchName: matchName,
            mode: mode
        }
    }
}

export const startMatchMode = (matchName, mode) => {
    return (dispatch, getState) => {
        request(_startMatchMode(matchName, mode))
        .then((resp) => {
            // resp is a timeRemaining
            dispatch(currentMatchTimeRemainingUpdated(resp.matchName, resp.timeRemaining));
        });
    }
}