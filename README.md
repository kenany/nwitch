# nwitch

[![Dependency Status](https://gemnasium.com/KenanY/nwitch.png)](https://gemnasium.com/KenanY/nwitch)

nwitch is a [TwitchTV](http://www.twitch.tv/) bot written in JavaScript and
designed to work in [Node.js](http://nodejs.org/).

  - **Full control.** You control your bot. Any of the current services that
  host bots could disappear tomorrow. What would you do then? nwitch will be
  around as long as you are, since it doesn't have to pay bills by begging for
  donations or placing advertisements in its interface.
  - **As fast as that new graphics card of yours.** nwitch doesn't have to split
  its resources across hundreds of channels like other bots. This allows nwitch
  to run as efficiently as possible, which means faster spam detection and
  quicker disciplinary actions.
  - **Modular.** Only download and execute what you need for your channel. This
  results in faster startup times and no cluttered interfaces, which gives you
  more time for streaming.
  - **Open-source.** Why give a closed-source bot moderation privileges? You
  don't know when the author could go rogue! nwitch's complete source code can
  be viewed and audited, which makes it more trustworthy than any other bot out
  there (if you read the source, of course).
  - **Diabetic-friendly.** No syntax sugar from CoffeeScript or the like to
  get in the way of the underlying JavaScript. This allows nearly anyone to
  write plugins for nwitch. nwitch's open plugin ecosystem makes it the most
  powerful chat moderation bot around.

## Download

You can download nwitch with [git](http://git-scm.com/). Remember that you need
Node.js installed to build and run the bot.

``` bash
$ git clone https://github.com/KenanY/nwitch.git --depth 1
$ cd nwitch
$ npm install grunt-cli -g
```

## Usage

Being a self-hosted bot, nwitch requires a bit more effort to set up than other
bots.

### Configuration

Create a new TwitchTV account for your bot. Preferably, the username should make
it clear to your viewers that the account is a bot.

Then, rename `sample.config.toml` to `config.toml`. This configuration file is a
[TOML](https://github.com/mojombo/toml) file, so editing and reading it should
be easy thanks to obvious semantics.

As of Septemner 17, 2013, TwitchTV now requires an OAuth token in order to log
into the IRC of a channel. Since nwitch does use IRC for chat moderation, you
will need to generate this OAuth token. Use
[this tool](http://twitchapps.com/tmi/) to generate a token. The entire
token (including `oauth:`) should be your `account.password` in `config.toml`.

### Building

Once that's done, it's time to build the bot.

``` bash
$ grunt
```

### Initializing

You must run nwitch every time you start streaming, and leave it running in the
background throughout your streaming session.

``` bash
$ node nwitch
```

You will then find nwitch's dashboard by going to <http://localhost:3001>
(unless you changed `server.port` in `config.toml`).

There is no reason to keep nwitch running while you're not streaming. As such,
you are free to terminate it when you're done streaming.

## FAQ

The following is a compilation of questions I expect to receive.

### Does it work on Windows?

Of course! In fact, nwitch was created specifically for Windows, because Windows
is the standard OS for gaming.

### Can it moderate multiple channels?

Unfortunately, each individual nwitch process is designed around managing only
one channel at a time. To manage multiple channels, you would need to run
multiple instances of nwitch on different ports.

### How do I know nwitch doesn't transmit the bot's account credentials to you?

If you read the source code you'll see that no information is transmitted to me.

### Isn't it dangerous to store the account credentials in plaintext?

Yes, and this will hopefully change in the future. If an attacker did get the
credentials, the worst they could do is timeout your viewers (which you can
revert).

### Is there a hosted version?

No; nwitch was conceived as a self-hosted bot. There is no reason to have a
hosted version that runs 24/7, because the features it provides are only useful
while you're streaming.

## Contributing

See `CONTRIBUTING.md` for guidelines on contributions.

## License

MIT, see `LICENSE.md`.