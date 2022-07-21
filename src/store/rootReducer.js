import { combineReducers } from 'redux';
import  * as search  from './search/reducer';
import  * as filter  from './filter/reducer';
import * as auth from './disableMenu/reducer';
import * as address from './chain/reducer'

const rootReducer = combineReducers({
    getSearchValue: search.getSearchValue,
    Filter: filter.getFilterValue,
    Auth: auth.getAuthenticate,
    Address: address.getAddress
});

export default rootReducer;