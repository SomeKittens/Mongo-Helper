'use strict';

var mongo = require('mongodb')
  , server = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {auto_reconnect: true})
  , mdb = new mongo.Db('dormless', server, {safe: true});
/**
 * Basic helper for database CRUD operations.
 * func is an optional argument that is executed after the async calls have 
 * completed.  The results of the find query (if applicable) will be passed to it
 * AFTER the database is closed, so you can execute another db call.
 */

module.exports = {
  insert: function(coll, query, func) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.insert(query, function() {
          db.close();
          if(typeof func === 'function') { func(); }
        });
      });
    });
  },
  find: function(coll, query, func) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.find(query).toArray(function(err, results) {
          if(err) { console.error(err);db.close();return; }
          db.close();
          if(typeof func === 'function') { func(results); }
        });
      });
    });
  }
};
