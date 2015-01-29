#!/usr/bin/env node

'use strict';

var logger = require('../lib/logger');

// start service
module.exports = require('../lib/service')(function microServiceInitialized(err) {
  if (err) {
    logger.error('Can\'t start service: ', err);
  } else {
    logger.info('service started');
  }
});
