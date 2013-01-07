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

//Takes care of rote work that every operation needs
//coll is the name of the collection we're operating on
//next is an optional callback.  If the operation returns results, they'll be 
//    passed to next.
//operation contains the db operation that we want to execute
function getCollection(coll, next, operation) {
  mdb.open(function(err, db) {
    db.collection(coll, function(err, collection) {
      operation(err, collection, function(err, results) {
        if(err) { console.error(err); }
        db.close();
        if(typeof next === 'function') {
          next(results);
        }
      });
    });
  });
}

module.exports = {
  insert: function(coll, query, next) {
    getCollection(coll, next, function(err, collection, after) {
      collection.insert(query, after);
    });
  },
  find: function(coll, query, next) {
    getCollection(coll, next, function(err, collection, after) {
      collection.find(query).toArray(after);
    });
  },
  update: function(coll, criteria, update, params, next) {
    getCollection(coll, next, function(err, collection, after) {
      collection.update(criteria, update, params, after);
    });
  },
  remove: function(coll, query, next) {
    getCollection(coll, next, function(err, collection, after) {
      collection.remove(query, after);
    });
  }
};
