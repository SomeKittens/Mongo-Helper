'use strict';

/**
 * Configuration file containing defaults for mongo helper
 */

var config = {}
  , mongo = require('mongodb');

//Address where the server running Mongo can be found
config.serverAddress = 'localhost';
//Port we'll be using to connect to the server
config.serverPort = mongo.Connection.DEFAULT_PORT;
//Any parameters (in an object literal) we'll want to pass to the server
config.serverOptions = {auto_reconnect: true};

//db we'll be using to connect to
config.dbName = 'test';
//Parameters to pass to the database
config.dbOptions = {safe: true};

module.exports = config;
