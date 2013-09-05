var Bot = require('./lib/core/bot');
var App = require('./lib/core/app');

var nwitch = new Bot('./config.toml');
var dashboard = new App(nwitch.getConfig());

nwitch.spawn();
dashboard.spawn();