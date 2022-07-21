import * as actionTypes from './type';
const initialState = {
    address : ''
}

export const getAddress = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ADDRESS:
            return {
                address: action.payload.address
            };
        default: return state;
    }
};