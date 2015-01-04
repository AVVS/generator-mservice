'use strict';

var utils = require('mservice-utils');
var _ = require('lodash-node');
var cfg = utils.loadConfig(require('../config.json'));
var singleton;

module.exports = function (configuration) {
  if (singleton) {
    return singleton;
  }

  configuration = configuration || {};
  singleton = _.extend(cfg, configuration);
  
  return singleton;
};
