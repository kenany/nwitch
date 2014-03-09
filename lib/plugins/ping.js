function ping() {
  return function(irc) {
    irc.on('message', function(evt) {
      var from = evt.from;
      var to = evt.to;
      if (evt.message.charAt(0) === '!') {
        var command = evt.message.split(' ')[0].replace('!', '');
        if (command === 'ping') {
          irc.send((to.charAt(0) === '#' ? to : from), from + ': pong!');
        }
      }
    });
  };
}

module.exports = ping;