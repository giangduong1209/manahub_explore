import * as actionTypes from './type';
const initialState = {
    searchValue: '',
    isSearch: false
}; //Initial state of the search

export const getSearchValue = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SEARCH_VALUE:
            return {
                searchValue: action.payload.searchValue,
                isSearch: action.payload.isSearch
            };
        default: return state;
    }
};
