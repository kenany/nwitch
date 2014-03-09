var net = require('net');
var irc = require('slate-irc');
var logger = require('./logger');

var ping = require('./plugins/ping');

/**
 * Initialize an IRC bot.
 *
 * @param {Object} config
 */
function Nwitch(config) {
  if (!(this instanceof Nwitch)) return new Nwitch(config);

  this.config = config;

  var stream = net.connect({
    port: config.irc.port,
    host: config.irc.address
  });

  this.client = irc(stream);
  this.client.pass(config.account.password);
  this.client.nick(config.account.username);
  this.client.user(config.account.username, config.account.username);
  this.client.join('#' + config.account.channel);

  this.client.use(ping());

  if (config.debug) {
    this.client.on('message', function(evt) {
      logger.info('<' + evt.from + '> ' + evt.message);
    });
  }
}

/**
 * Use the given plugin `fn`.
 *
 * @param {Function} fn
 * @return {Nwitch} self
 * @api public
 */
Nwitch.prototype.use = function(fn) {
  this.client.use(fn());
  return this;
};

module.exports = Nwitch;