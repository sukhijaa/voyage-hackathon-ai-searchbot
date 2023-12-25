import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom"
import routes from './routes.js';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore.js';
import { PersistGate } from 'redux-persist/integration/react'

const config = configureStore();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={config.store}>
      <PersistGate persistor={config.persistor}>
      <RouterProvider router={routes}/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
