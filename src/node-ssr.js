/* global NODE_ENV */
/* eslint-disable no-console */

import React from 'react';
import ReactDOM from 'react-dom/server';
import Express from 'express';
import path from 'path';
import url from 'url';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { StaticRouter } from 'react-router';
import { matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import webRoutes from 'routes';
import apiRoutes from 'api';
import ClientContainer from 'containers/client-container';
import configureStore from 'reducers';
import { renderHTML, getUserToken, fetchUserData } from 'helpers/ssr';
import { MONGO } from 'data/config';
import mongoose from 'mongoose';

const debug = require('debug')('milkicons_:ssr');
require('es6-promise').polyfill();
require('isomorphic-fetch');

mongoose.connect(MONGO.url, MONGO.options).then(() => {
  debug('Connected to MongoDB');
}).catch((err) => {
  console.error('Please check your MongoDB connection parameters');
  process.exit(1);
});

const app = new Express();

app.disable('x-powered-by');

const staticOptions = {
  expires: '1M',
  etag: false,
  setHeaders: (res) => {
    res.set({ 'Cache-Control': 'public', ETag: '' });
  },
};

if (NODE_ENV === 'dev') {
  app.use(logger('dev'));
}

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/favicon.ico', Express.static(path.join(__dirname, '..', 'public', 'static', 'favicons', 'favicon.ico'), staticOptions));
app.use('/apple-touch-icon.png', Express.static(path.join(__dirname, '..', 'public', 'static', 'favicons', 'apple-touch-icon.png'), staticOptions));
app.use('/assets', Express.static(path.join(__dirname, '..', 'public', 'assets'), staticOptions));
app.use('/static', Express.static(path.join(__dirname, '..', 'public', 'static'), staticOptions));
app.use('/api', apiRoutes);

// process request
app.use((req, res) => {
  const store = configureStore();
  const context = {};
  const token = getUserToken(req.headers);
  let location = url.parse(req.url);
  let body = '';
  let type = 'client';

  location = { pathname: location.pathname, query: location.query };

  Promise.all(fetchUserData(token))
    .then((userData) => {
      if (location.pathname.indexOf('/admin') === 0) {
        type = 'admin';
      } else {
        // SSR is enabled for client only

        // find matched route
        webRoutes.some((route) => {
          return matchPath(location.pathname, route);
        });

        // render content
        body = ReactDOM.renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <ClientContainer />
            </StaticRouter>
          </Provider>
        );
      }

      // check for redirect
      if (context.url) {
        res.set({ Location: context.url });
        res.status(301).end();
        return;
      }

      // make HTML response
      const content = renderHTML(body, store.getState(), type);

      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
        ETag: '',
      });

      res.status(context.status || 200).end(content);
    })
    .catch((error) => {
      debug(`request error: ${err}`);
      res.status(500).end('Internal server error');
    })
});

export default app;
