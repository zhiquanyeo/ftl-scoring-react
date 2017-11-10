import { REGISTRATION } from '../actions/systemActions';

const initialState = {
    id: null
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case REGISTRATION:
            return {
                id: payload
            }
        default:
            return state;
    }
}