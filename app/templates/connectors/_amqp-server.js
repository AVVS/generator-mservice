'use strict';

var _ = require('lodash-node');
var config = require('../lib/config.js')();
var cfg = _.pick(config, ['listen', 'queue', 'name']);
var utils = require('mservice-utils');
var amqpServer;

module.exports = function (handleMessages, callback) {
    if (typeof handleMessages === 'function' && typeof callback === 'function') {
        amqpServer = utils.common.connectToAMQP(cfg, handleMessages, callback);
    }

    if (!amqpServer) {
        throw new Error('amqpServer not initialized');
    }

    return amqpServer;
};
