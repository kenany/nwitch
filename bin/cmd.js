#!/usr/bin/env node

var path = require('path');
var fs = require('graceful-fs');
var findup = require('findup-sync');
var minimist = require('minimist');
var resolve = require('resolve').sync;
var toml = require('toml');

var logger = require('../lib/logger');

var argv = minimist(process.argv.slice(2), {
  alias: {v: 'version'}
});

if (argv._[0] === 'init') {
  require('./init')();
}
else if (argv.v) {
  logger.info(require('../package.json').version);
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
    var buffer = fs.readFileSync(configFile);
    var config = toml.parse(buffer.toString());
    var nwitch = require(nwitchPath)(config);

    for (var key in config.plugins) {
      var plugin;
      var opts = config.plugins[key];

      try {
        plugin = require(key);
      } catch (e) {
        logger.error('Failed to require plugin "' + key + '".');
        process.exit(1);
      }

      nwitch.use(plugin(opts));
    }
  }
}