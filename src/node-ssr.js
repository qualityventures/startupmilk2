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
import webRoutes from 'routes';
import apiRoutes from 'api';
import WebContainer from 'containers/web-container';
import { renderClientHTML } from 'helpers/server';

require('es6-promise').polyfill();
require('isomorphic-fetch');

/* global NODE_ENV */
/* eslint-disable no-console */

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
  let location = url.parse(req.url);
  location = { pathname: location.pathname, query: location.query };

  // find matched route
  webRoutes.some((route) => {
    return matchPath(location.pathname, route);
  });

  const context = {};

  // render content
  const clientHTML = ReactDOM.renderToString(
    <StaticRouter location={req.url} context={context}>
      <WebContainer />
    </StaticRouter>
  );

  // check for redirect
  if (context.url) {
    res.set({ Location: context.url });
    res.status(301).end();
    return;
  }

  // make HTML response
  const content = renderClientHTML(clientHTML);

  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
    ETag: '',
  });

  res.status(context.status || 200).end(content);
});

export default app;
