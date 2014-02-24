#!/usr/bin/env node

var path = require('path');
var findup = require('findup-sync');
var minimist = require('minimist');
var resolve = require('resolve').sync;

var logger = require('../lib/core/logger');

var argv = minimist(process.argv.slice(2));

if (argv._[0] === 'init') {
  require('./init')();
}
else {
  var base = process.cwd();
  var nwitchPath;
  try {
    nwitchPath = resolve('nwitch', {basedir: base});
  } catch (error) {
    nwitchPath = findup('lib/index.js');
  }

  if (!nwitchPath) {
    logger.error('Unable to find local nwitch.');
    logger.error('Did you run `npm install nwitch`?');
  }
  else {
    var configFile = path.resolve(base, './config.toml');
    require(nwitchPath)(configFile);
  }
}