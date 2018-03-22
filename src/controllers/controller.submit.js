/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON, returnOkWithoutBody } from 'helpers/response';
import { validateEmail, validatePortfolio } from 'helpers/validators';
import debug from 'debug';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import stream from 'stream';

const log = debug(`${DEBUG_PREFIX}:controller.submit`);
const file = path.join(__dirname, '..', '..', 'data', 'submits.txt');

export function getSubmits(req, res) {
  const verify = req.query.verify || false;

  if (verify !== 'qknwdk123') {
    throwError(res, 'invalid_api_endpoint');
    return;
  }

  try {
    const instream = fs.createReadStream(file);
    const outstream = new stream;
    const rl = readline.createInterface(instream, outstream);
    const submits = [];

    rl.on('line', (line) => {
      let email = line;
      let portfolio = '';
      const pos = line.indexOf(' ');

      if (pos > 0) {
        email = line.substring(0, pos);
        portfolio = line.substring(pos + 1);
      }

      submits.push({ email, portfolio });
    });

    rl.on('close', () => {
      returnObjectAsJSON(res, submits);
    });
  } catch (err) {
    throwError(res, 'Error while reading data');
  }
}

export function submitForm(req, res) {
  const { email, portfolio } = req.body;

  const email_validation = validateEmail(email);
  const portfolio_validation = validatePortfolio(portfolio);

  if (email_validation !== true) {
    throwError(res, email_validation);
    return;
  }

  if (portfolio_validation !== true) {
    throwError(res, portfolio_validation);
    return;
  }

  try {
    fs.appendFileSync(file, `${email} ${portfolio}\n`);
  } catch (err) {
    log(err);
    throwError(res, 'Error while saving data');
    return;
  }

  let i;
  let count = 0;

  try {
    fs.createReadStream(file)
      .on('data', (chunk) => {
        for (i = 0; i < chunk.length; ++i) {
          if (chunk[i] === 10) count++;
        }
      })
      .on('end', () => { 
        returnObjectAsJSON(res, { pos: count });
      });
  } catch (err) {
    log(err);
    returnOkWithoutBody(res);
  }
}
