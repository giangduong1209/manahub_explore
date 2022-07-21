import * as actionTypes from './type';

// export const getSearchValue = (searchValue) => ({ type: actionTypes.GET_SEARCH_VALUE, payload: searchValue });

export const getSearchValues = (value) => dispatch => dispatch({
    type: actionTypes.GET_SEARCH_VALUE,
    payload: value
  });