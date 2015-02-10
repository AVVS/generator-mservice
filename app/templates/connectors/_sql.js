'use strict';

var config = require('../lib/config.js')();
var async = require('async');
var utils = require('mservice-utils');

<% if (connectorSQL_createSchema) { %>// schema to set on the postgres
var fs = require('fs');
var sqlSchema = fs.readFileSync(__dirname + '/sql/schema.sql', 'utf-8');
var sqlSequence = fs.readFileSync(__dirname + '/sql/sequence.sql', 'utf-8');<% } %>

// must be init
var sqlClient;

module.exports = function initSQL(callback) {
    if (typeof callback === 'undefined') {
        return sqlClient;
    }

    async.series([
        function connectToSQL(next) {
            sqlClient = new utils.Sql(config.sql, next);
        }<% if (connectorSQL_createSchema) { %>,

        function createDatabase(next) {
            sqlClient.ensureDatabaseExists(config.sql.database, next);
        },

        function createStructure(next) {
            sqlClient.sequence([sqlSequence, sqlSchema], next);
        }<% } %>

    ], function sqlConnectionInitialized(err) {
        if (err) {
            return callback(err);
        }

        return callback(null, sqlClient);
    });
};
