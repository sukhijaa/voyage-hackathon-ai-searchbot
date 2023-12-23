import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom"
import routes from './routes';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={routes}/>
    </Provider>
  </React.StrictMode>
);
