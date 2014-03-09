# nwitch

[![Dependency Status](https://gemnasium.com/KenanY/nwitch.png)](https://gemnasium.com/KenanY/nwitch)

nwitch is a simple, pluggable IRC bot written in JavaScript and designed to work
in [Node.js](http://nodejs.org/).

nwitch was initially conceived as a [TwitchTV](http://www.twitch.tv/) chat
moderation bot, whose functions would be defined through individual plugins.
However, its scope has since widened, considering how it is the plugins that
choose whether to be specific to TwitchTV or not.

Currently, nwitch is in early development. There are no guarantees that anything
is working at any particular point in time.

## Installation

  - [TwitchTV guide](https://github.com/KenanY/nwitch/wiki/TwitchTV)

``` bash
$ npm install nwitch
```

## API

### new Nwitch(config)

Creates a new Nwitch instance.

### #use(plugin)

Adds the given `plugin` function.