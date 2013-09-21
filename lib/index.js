var Bot = require('./core/bot');
var App = require('./core/app');

module.exports = function() {
  var nwitch = new Bot('./config.toml');
  var dashboard = new App(nwitch.getConfig());

  nwitch.spawn();
  dashboard.spawn();
};