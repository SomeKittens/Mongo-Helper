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
 
function getCollection(coll, callback) {
  mdb.open(function(err, db) {
    db.collection(coll, callback);
  });
}

function cleanup(next, db) {
  return function() {
    db.close();
    if(typeof next === 'function') {
      next();
    }
  };
}

function error(err, db) {
  if(err) {
    console.error(err);
    db.close();
  }
}

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
  update: function(coll, criteria, update, params, next) {
    mdb.open(function(err, db) {
      db.collection(coll, function(err, collection) {
        collection.update(criteria, update, params, function(err, updated) {
          if(err) { console.error(err);db.close();return; }
          db.close();
          if(typeof next === 'function') { next(updated); }
        });
      });
    });
  },
  remove: function(coll, query, next) {
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
