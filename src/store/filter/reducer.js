import * as actionTypes from './type';
const initialState = {
    filterSort: '',
    filterPrice: '',
    filterCategory: ''
}; //Initial state of the search

export const getFilterValue = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.GET_FILTER_SORT_VALUE:
            return {
                ...state,
                filterCategory: '',
                filterPrice: '',
                filterSort: action.payload.sortValue
            };
        case actionTypes.GET_FILTER_PRICE_VALUE:
            return {
                ...state,
                filterCategory: '',
                filterSort: '',
                filterPrice: action.payload.priceValue,
            };
        case actionTypes.GET_FILTER_CATEGORY_VALUE:
            return {
                ...state,
                filterPrice: '',
                filterSort: '',
                filterCategory: action.payload.categoryValue,
            };
        default: return state;
    }
};
