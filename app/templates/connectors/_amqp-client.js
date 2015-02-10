'use strict';

var utils = require('mservice-utils');
var amqpClient;

module.exports = function (callback) {
    if (typeof callback === 'function') {
        amqpClient = new utils.AMQP(callback);
    }

    return amqpClient;
};
