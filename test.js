'use strict';
/*global suite:false*/
/*global test:false*/

/**
 * Some basic tests to make sure I didn't screw up anything
 */

var config = require('./configDefaults')
  , mongoHelper = new (require('./mongo-helper'))()
  , mongo = require('mongodb')
  , server = new mongo.Server(config.serverAddress, config.serverPort, config.serverOptions)
  , mdb = new mongo.Db(config.dbName, server, config.dbOptions)
  , assert = require('assert');

//checkResult is for testing methods that impact that database instead of returning something
//expected is what's supposed to be under the foo slot in the database.
function checkResult(expected, msg, done) {
  mdb.open(function(err, db) {
    db.collection('helperTest', function(err, collection) {
      collection.find({foo: expected}).toArray(function(err, results) {
        if(err) { console.error(err);db.close();return; }
        db.close();
        assert.equal(results[0].foo, expected, msg);
        done();
      });
    });
  });
}

suite('insert', function() {
  test('insert should add data to the database', function(done) {
    mongoHelper.insert('helperTest', {foo: 'bar'}, function() {
      checkResult('bar', 'First insert failed', done);
    });
  });
  //Find tests don't use checkResult, as that would be silly
  test('find should return the data inserted in the previous test', function(done) {
    mongoHelper.find('helperTest', {foo: 'bar'}, function(results) {
      assert.equal(results[0].foo, 'bar', 'First Find test failed');
      done();
    });
  });
  test('find should also work with regular expressions', function(done) {
    mongoHelper.find('helperTest', {foo: new RegExp(/ar$/)}, function(results) {
      assert.equal(results[0].foo, 'bar', 'RegExp Find test failed');
      done();
    });
  });
  test('update should change data that is already in the db', function(done) {
    mongoHelper.update('helperTest', {foo: 'bar'}, {$set: {foo: 'baz'}}, {}, function(updated) {
      assert.equal(updated, 1, 'Update test returned incorrect value');
      checkResult('baz', 'Update check failed', done);
    });
  });
  test('remove should delete all the test data we have generated', function(done) {
    mongoHelper.remove('helperTest', {foo: 'baz'}, function(removed) {
      assert.equal(removed, 1, 'Remove test returned incorrect value');
      mdb.open(function(err, db) {
        db.collection('helperTest', function(err, collection) {
          collection.find({foo: 'baz'}).toArray(function(err, results) {
            if(err) { console.error(err);db.close();return; }
            db.close();
            assert.deepEqual(results, [], 'Remove test failed');
            done();
          });
        });
      });
    });
  });
});
