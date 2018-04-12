/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import onload from 'helpers/onload';
import configureStore from 'reducers';
import AdminApp from 'containers/admin-app';

require('es6-promise').polyfill();
require('isomorphic-fetch');

onload(() => {
  console.log(window.REDUX_INITIAL_STATE);
  
  const store = configureStore(window.REDUX_INITIAL_STATE || {});
  const container = document.getElementById('react-root');

  window.REDUX_INITIAL_STATE = null;
  window.REDUX_STORE = store;

  // React HMR
  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    render(<AppContainer><AdminApp /></AppContainer>, container);

    if (typeof module !== 'undefined' && module.hot) {
      module.hot.accept('./containers/admin-app', () => {
        const NewAdminApp = require('containers/admin-app').default;
        render(<AppContainer><NewAdminApp /></AppContainer>, container);
      });
    }
    
    return;
  }

  // Prod
  render(<AdminApp />, container);
});
