'use strict';

const config = require("./webpack.config.js");

const path = require('path');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = config;

module.exports.serve = {
  content: [__dirname],
  add: (app, middleware, options) => {
    const historyOptions = {
        verbose: true,
      // ... see: https://github.com/bripkens/connect-history-api-fallback#options
    };

    app.use(convert(history(historyOptions)));
  }
};