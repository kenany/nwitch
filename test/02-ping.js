var Nwitch = require('../');
var test = require('tape');
var ircd = require('ircd');
var slate = require('slate-irc');
var net = require('net');

var irc;
var n;
var pinger;

test('setup', function(t) {
  irc = ircd.createServer({name: 'localhost'});
  irc.listen(51402);
  t.end();
});

test('pongs', function(t) {
  t.plan(5);

  irc.on('channel', function(channel) {
    t.equal(channel.name, '#nwitch');

    channel.on('join', function(user) {
      t.ok(user.nick === 'kenan' || user.nick === 'pinger');

      user.on('PRIVMSG', function(m) {
        if (user.nick === 'kenan') {
          t.deepEqual(m.params, ['#nwitch', ':!ping']);
        }
        else {
          t.deepEqual(m.params, ['#nwitch', 'pinger: pong!']);
        }
      });
    });
  });

  n = new Nwitch({
    irc: {
      address: 'localhost',
      port: 51402
    },
    account: {
      username: 'kenan',
      password: '',
      channel: 'nwitch'
    }
  });

  var stream = net.connect({
    host: 'localhost',
    port: 51402
  });

  pinger = slate(stream);

  pinger.nick('pinger');
  pinger.user('pinger', 'Pinger McPongerton');

  pinger.join('#nwitch');
  pinger.send('#nwitch', ':!ping');
});

test('cleanup', function(t) {
  irc.close();
  n.quit();
  pinger.quit();
  t.end();
});