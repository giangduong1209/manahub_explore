import * as actionTypes from './type';

// export const getSearchValue = (searchValue) => ({ type: actionTypes.GET_SEARCH_VALUE, payload: searchValue });

export const getFilterPriceValue = (value) => dispatch => dispatch({
  type: actionTypes.GET_FILTER_PRICE_VALUE,
  payload: value
});

export const getFilterSortValue = (value) => dispatch => dispatch({
  type: actionTypes.GET_FILTER_SORT_VALUE,
  payload: value
});

export const getFilterCategoryValue = (value) => dispatch => dispatch({
  type: actionTypes.GET_FILTER_CATEGORY_VALUE,
  payload: value
});