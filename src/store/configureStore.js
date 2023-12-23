import { applyMiddleware, createStore } from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import createReducer from './reducers'

export default function configureStore(preloadedState) {
  const middlewares = [thunk]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(createReducer(), preloadedState, composedEnhancers)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(createReducer()))
  }

  return store
}