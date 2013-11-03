var Bot = require('./core/bot');
var App = require('./core/app');

module.exports = function(configFile) {
  var nwitch = new Bot(configFile);
  var dashboard = new App(nwitch.getConfig());

  nwitch.spawn();
  dashboard.spawn();
};