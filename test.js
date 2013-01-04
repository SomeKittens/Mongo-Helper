'use strict';

/**
 * Some basic tests to make sure I didn't screw up anything
 */

var mongoHelper = require('./mongoHelper');

mongoHelper.insert('helperTest', {foo: 'bar'}, function() {
  mongoHelper.find('helperTest', {foo: 'bar'}, function(results) {
    console.log(results);
    mongoHelper.update('helperTest', {foo: 'bar'}, {foo: 'baz'}, {}, function() {
      mongoHelper.find('helperTest', {foo: new RegExp(/^ba/)}, function(results) {
        console.log(results);
        mongoHelper.remove('helperTest', {foo: 'baz'}, function(removed){
          console.log(removed);
        });
      });
    });
  });
});
