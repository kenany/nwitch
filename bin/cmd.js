#!/usr/bin/env node

var path = require('path');
var findup = require('findup-sync');
var resolve = require('resolve').sync;

var logger = require('../lib/core/logger');

var base = process.cwd();

var nwitchPath;
try {
  nwitchPath = resolve('nwitch', {basedir: base});
} catch (error) {
  nwitchPath = findup('lib/index.js');
  if (!nwitchPath) {
    logger.error('Unable to find local nwitch.');
  }
}

var configFile = path.resolve(base, './config.toml');

require(nwitchPath)(configFile);