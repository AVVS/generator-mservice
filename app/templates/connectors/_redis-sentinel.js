'use strict';

var config = require('../lib/config.js')();
var RedisSentinel = require('redis-sentinel-client');
var sentinelClient;

module.exports = function (callback) {
    if (typeof callback === 'function') {
        sentinelClient = RedisSentinel.createClient(config.redisHA);

        var connected = function (err) {
            sentinelClient.removeListener('connect', connected);
            sentinelClient.removeListener('error', connected);
            return callback(err);
        };

        sentinelClient.once('sentinel connected', connected.bind(null, null));
        sentinelClient.once('error', connected);
    }

    if (!sentinelClient) {
        throw new Error('client has not been initialized');
    }

    return sentinelClient;
};
