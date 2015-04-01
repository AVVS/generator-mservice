'use strict';

var _ = require('lodash-node');
var config = require('../lib/config.js')();
var SwiftClient = require('ceph-s3');
var connection;

module.exports = function (callback) {
    if (typeof callback === 'function') {
        if (config.s3Users) {
            SwiftClient.init(config.s3Users);
        }

        connection = new SwiftClient(_.omit(config.s3, ['user']), config.s3.user, callback);
    }

    if (!connection) {
        throw new Error('s3 client has not been initialized');
    }

    return connection;
};

