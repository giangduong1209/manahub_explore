import * as actionTypes from './type';
const initialState = {
    authenticated : false
}

export const getAuthenticate = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_AUTHENTICATE:
            return {
                authenticated: action.payload.authenticated
            };
        default: return state;
    }
};