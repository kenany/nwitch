var behest = require('behest');

function ping() {
  return function(irc) {
    irc.on('message', function(evt) {
      var from = evt.from;
      var to = evt.to;

      if (!behest.isValid(evt.message)) {
        return;
      }

      var command = behest(evt.message).command;
      if (command === 'ping') {
        irc.send((to.charAt(0) === '#' ? to : from), from + ': pong!');
      }
    });
  };
}

module.exports = ping;