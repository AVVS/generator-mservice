'use strict';

var cfg = require('./config.js')();
var Logger = require('arklogger');
var logger = new Logger(cfg.name, 'dc-fremont');

module.exports = logger;
