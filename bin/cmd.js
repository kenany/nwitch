#!/usr/bin/env node

var path = require('path');
var findup = require('findup-sync');
var resolve = require('resolve').sync;

var base = process.cwd();

var nwitchPath;
try {
  nwitchPath = resolve('nwitch', {basedir: base});
} catch (error) {
  nwitchPath = findup('lib/index.js');
  if (!nwitchPath) {
    console.error('Unable to find local nwitch.');
  }
}

var configFile = path.resolve(base, './config.toml');

require(nwitchPath)(configFile);