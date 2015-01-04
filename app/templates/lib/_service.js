'use strict';

// 3rd party
var async = require('async');
var _ = require('lodash-node');

// configuration and local modules
var config = require('./config.js')();
var logger = require('./logger.js');

// connectors
<% if (connectorAMQPClient) { %>var amqpClient = require('./connectors/amqp-client.js');
<% } %><% if (connectorAMQPServer) { %>var amqp = require('./connectors/amqp.js');
<% } %><% if (connectorS3) { %>var s3 = require('./connectors/s3.js');
<% } %><% if (connectorSQL) { %>var sql = require('./connectors/sql.js');<% } %>
<% if (connectorAMQPServer) { %>
function handleMessages(message, info, raw, callback) {
  // write your own handler here
  // info.routingKey - is the route message came for
  <% if (connectorAMQPServer_neck) { %>
  // You've specified { ack: true, prefetchCount: <%= connectorAMQPServer_neck %> }
  // make sure that you call raw.acknowledge() or raw.reject(Boolean) or the service
  // will get stuck
<% } %>
}<% } %>

// init all connectors we use
module.exports = function initService(done) {
  var connectors = [];
  // add connectors to the init stack
<% if (connectorAMQPServer) { %>  connectors.push(async.apply(amqp, handleMessages));
<% } %><% if (connectorAMQPClient) { %>  connectors.push(amqpClient);
<% } %><% if (connectorS3) { %>  connectors.push(s3);
<% } %><% if (connectorSQL) { %>  connectors.push(sql);<% } %>

  async.parallel(connectors, done);
};
