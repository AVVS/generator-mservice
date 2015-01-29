'use strict';

var _ = require('lodash-node');
var config = require('../lib/config.js')();
var SwiftClient = require('scraping-utils').clients.SwiftClient;
var connection;

module.exports = function (callback) {
  if (typeof callback === 'function') {
    connection = new SwiftClient(_.omit(config.s3, ['user']), config.s3.user, callback);
  }

  return connection;
};

