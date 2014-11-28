var Nwitch = require('../');
var test = require('tape');
var isFunction = require('lodash.isfunction');

test('exports a function', function(t) {
  t.plan(1);

  t.ok(isFunction(Nwitch));
});