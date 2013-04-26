'use strict';

function Helper(config) {
  var mongo = require('mongodb');
  //Save us some time
  if(typeof config === 'undefined') {
    config = require('./configDefaults');
  } else {
    //Address where the server running Mongo can be found
    config.serverAddress = config.serverAddress || 'localhost';
    //Port we'll be using to connect to the server
    config.serverPort = config.serverPort || mongo.Connection.DEFAULT_PORT;
    //Any parameters (in an object literal) we'll want to pass to the server
    config.serverOptions = config.serverOptions || {auto_reconnect: true};
    //db we'll be using to connect to
    config.dbName = config.dbName || 'test';
    //Parameters to pass to the database
    config.dbOptions = config.dbOptions || {safe: true};
    //Used to connect to external instances of MongoDB
    config.url = config.url || false;
  }

  var server = new mongo.Server(config.serverAddress, config.serverPort, config.serverOptions)
    , mdb = new mongo.Db(config.dbName, server, config.dbOptions);
  /**
   * Takes care of rote work that every operation needs
   * coll is the name of the collection we're operating on
   * next is an optional callback.  If the operation returns results, they'll be
   *     passed to next.
   * operation contains the db operation that we want to execute
   */
  this.getCollection = function(coll, next, operation) {
    //TODO: clean this up
    if(config.url) {
      mongo.Db.connect(config.url, {db: config.dbOptions, server: config.serverOptions}, function(err, db) {
        db.collection(coll, function(err, collection) {
          operation(err, collection, function(err, results) {
            db.close();
            next(err, results);
          });
        });
      });
    } else {
      mdb.open(function(err, db) {
        db.collection(coll, function(err, collection) {
          operation(err, collection, function(err, results) {
            db.close();
            next(err, results);
          });
        });
      });
    }
  };
}

/**
 * Basic helper for database CRUD operations.
 * next is an optional argument that is executed after the async calls have
 * completed.  The results of the find query (if applicable) will be passed to it
 * AFTER the database is closed, so you can execute another db call.
 */
Helper.prototype = {
  insert: function(coll, query, next) {
    this.getCollection(coll, next, function(err, collection, after) {
      collection.insert(query, after);
    });
  },
  find: function(coll, query, next) {
    this.getCollection(coll, next, function(err, collection, after) {
      collection.find(query).toArray(after);
    });
  },
  update: function(coll, criteria, update, params, next) {
    this.getCollection(coll, next, function(err, collection, after) {
      collection.update(criteria, update, params, after);
    });
  },
  remove: function(coll, query, next) {
    this.getCollection(coll, next, function(err, collection, after) {
      collection.remove(query, after);
    });
  }
};

module.exports = Helper;
