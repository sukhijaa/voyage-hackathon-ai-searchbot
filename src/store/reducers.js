/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';

const initialState = {
    currentPage: "abc"
}
const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default function createReducer() {
  const rootReducer = combineReducers({
    global: globalReducer
  });

  return rootReducer;
}