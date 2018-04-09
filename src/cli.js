/* global NODE_ENV */
/* eslint-disable no-console */

import { MONGO } from 'data/config';
import { validatePassword, validateEmail } from 'helpers/validators';
import User from 'models/user';
import mongoose from 'mongoose';
import readline from 'readline';
import bcrypt from 'bcryptjs';

mongoose.connect(MONGO.url, MONGO.options).then(() => {

}).catch((err) => {
  console.error('Please check your MongoDB connection parameters');
  process.exit(1);
});

export function init() {
  User.init()
    .then(() => {
      console.log('init completed');
      process.exit(1);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    })
}

export function createAdminUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Email: ', (email) => {
    rl.question('Password: ', (pass1) => {
      rl.question('Repeat password: ', (pass2) => {
        if (pass1 !== pass2) {
          console.log('passwords do not match');
          process.exit(1);
        }

        const pass_validation = validatePassword(pass1);
        const email_validation = validateEmail(email);

        if (pass_validation !== true) {
          console.log(pass_validation);
          process.exit(1);
        }

        if (email_validation !== true) {
          console.log(email_validation);
          process.exit(1);
        }

        const hashed_password = bcrypt.hashSync(pass1, 8);

        User.create({
          email,
          role: 'admin',
          hashed_password,
        },
        function (err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log('User have been added successfully');
          }

          process.exit(1);
        }); 
      });
    });
  });
}
