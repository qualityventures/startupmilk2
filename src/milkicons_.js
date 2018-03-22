/* global module */
/* global NODE_ENV */
/* eslint-disable global-require */

import React from 'react';
import ReactDOM from 'react-dom';
import onload from 'helpers/onload';
import WebApp from 'containers/web-app';

require('es6-promise').polyfill();
require('isomorphic-fetch');

onload(() => {
  const container = document.getElementById('react-root');

  // React HMR
  if (NODE_ENV === 'dev') {
    const AppContainer = require('react-hot-loader').AppContainer;

    ReactDOM.hydrate(<AppContainer><WebApp /></AppContainer>, container);

    if (typeof module !== 'undefined' && module.hot) {
      module.hot.accept('./containers/web-app', () => {
        const NewWebApp = require('containers/web-app').default;
        ReactDOM.hydrate(<AppContainer><NewWebApp /></AppContainer>, container);
      });
    }
    
    return;
  }

  // Prod
  ReactDOM.hydrate(<WebApp />, container);
});
