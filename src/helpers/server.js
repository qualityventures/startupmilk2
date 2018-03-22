/* global NODE_ENV */

import fs from 'fs';
import path from 'path';

let _bundle_cache = {};
let _bundle_updated = 0;

function getBundleCache() {
  const time = Math.round(new Date().getTime() / 1000);
  if ((time - _bundle_updated) < 5) {
    return _bundle_cache;
  }

  try {
    const file = path.join(__dirname, '..', '..', 'bundle-cache.json');
    const content = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(content);

    _bundle_cache = json;
  } catch (err) {
    // 
  }

  _bundle_updated = time;
  return _bundle_cache;
}

/**
 *  Make path to script
 */
function makePathToAsset(bundle, ext) {
  const cache = getBundleCache();

  if (!cache[bundle]) {
    return '';
  }

  if (!cache[bundle][ext]) {
    return '';
  }

  if (ext === 'js') {
    return `<script src="/assets/${cache[bundle][ext]}" async></script>`;
  }

  if (ext === 'css') {
    return `<link href="/assets/${cache[bundle][ext]}" rel="stylesheet" />`;
  }

  return '';
}

export function renderClientHTML(clientHTML) {
  let scripts = '';
  let styles = '';

  if (NODE_ENV === 'dev') {
    scripts = '<script src="/assets/bundle.js" async></script>';
  } else {
    scripts = makePathToAsset('bundle', 'js');
    styles = makePathToAsset('bundle', 'css');
  }

  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <link rel="alternate" hreflang="x-default" href="//startupmilk.co/" />
        <title>startupmilk</title>
        <meta name="format-detection" content="telephone=no">
        <meta name="format-detection" content="address=no">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        ${styles}
        <script src="/static/js/jquery.js"></script>
        <script src="/static/js/migrate.js"></script>
        <script src="/static/js/library.js"></script>
        <script src="/static/js/script.js"></script>
      </head>
      <body style="padding: 0px; margin: 0px;">
        <div id="react-root">${clientHTML}</div>
        ${scripts}
        <div class="metrics">
          <!-- Global site tag (gtag.js) - Google Analytics -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-111430722-2"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-111430722-2');
          </script>
        </div>
      </body>
    </html>
  `.trim().replace(/^ {4}/gm, '');

  return html;
}
