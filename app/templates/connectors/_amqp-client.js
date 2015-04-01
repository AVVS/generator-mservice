'use strict';

var utils = require('mservice-utils');
var amqpClient;

module.exports = function (callback) {
    if (typeof callback === 'function') {
        amqpClient = new utils.AMQP(callback);
    }

    if (!amqpClient) {
        throw new Error('aqpClient not initialized');
    }

    return amqpClient;
};
