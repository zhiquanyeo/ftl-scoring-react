import request from '../api/Request';

export const TEAM_LIST_UPDATED = 'TEAM_LIST_UPDATED';
export const teamListUpdated = (teamList) => {
    // teamList is an object where keys = ID and value = team name
    return {
        type: TEAM_LIST_UPDATED,
        payload: {
            teamList: teamList
        }
    }
};

export const ADD_TEAM = 'ADD_TEAM';
const _addTeam = (id, name) => {
    return {
        type: ADD_TEAM,
        payload: {
            id: id,
            name: name
        }
    }
};
export const addTeam = (id, name) => {
    return (dispatch, getState) => {
        request(_addTeam(id, name))
        .then((resp) => {
            console.log('resp for addTeam: ', resp);
            // resp is teamList
            dispatch(teamListUpdated(resp));
        });
    }
}

export const DELETE_TEAM = 'DELETE_TEAM';
const _deleteTeam = (id) => {
    return {
        type: DELETE_TEAM,
        payload: {
            id: id,
        }
    }
};
export const deleteTeam = (id) => {
    return (dispatch, getState) => {
        request(_deleteTeam(id))
        .then((resp) => {
            // resp is teamList
            dispatch(teamListUpdated(resp));
        });
    }
}

