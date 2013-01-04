'use strict';

var mongo = require('mongodb')
  , config = require('./config')
  , server = new mongo.Server(config.serverAddress, config.serverPort, config.serverParams)
  , mdb = new mongo.Db(config.dbName, server, config.dbParams);

/**
 * Basic helper for database CRUD operations.
 * next is an optional argument that is executed after the async calls have 
 * completed.  The results of the find query (if applicable) will be passed to it
 * AFTER the database is closed, so you can execute another db call.
 */

module.exports = {
  insert: function(coll, query, next) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.insert(query, function() {
          db.close();
          if(typeof next === 'function') { next(); }
        });
      });
    });
  },
  find: function(coll, query, next) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.find(query).toArray(function(err, results) {
          if(err) { console.error(err);db.close();return; }
          db.close();
          if(typeof next === 'function') { next(results); }
        });
      });
    });
  },
  //TODO:
  //update: function(
  remove: function(coll, query, func) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.remove(query, function(err, removed) {
          db.close();
          if(typeof next === 'function') { next(removed); }
        });
      });
    });
  }
};
