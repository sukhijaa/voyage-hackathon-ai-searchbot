import { applyMiddleware, createStore } from 'redux'
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session.js'
 
import rootReducer from './reducers.js'
 
const persistConfig = {
  key: 'searchbot',
  storage,
}
 
const reducers = rootReducer();
const persistedReducer = persistReducer(persistConfig, reducers)

export default function configureStore(preloadedState) {
  const middlewares = [thunk]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(persistedReducer, preloadedState, composedEnhancers)
  const persistor = persistStore(store)

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(reducers))
  }

  return {persistor, store}
}