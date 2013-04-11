# nwitch

nwitch is a [TwitchTV](http://www.twitch.tv/) bot written in
[node](http://nodejs.org/). It is currently early in development, and I actually
recommend _against_ using it for the time being.

## Download

You can download nwitch with [git](http://git-scm.com/). Remember that you need
node installed to build and run the bot.

``` bash
$ git clone https://github.com/KenanY/nwitch.git --depth 1
$ cd nwitch
$ npm install grunt-cli -g
$ npm install
```

## Usage

Being a self-hosted bot, nwitch requires a bit more effort than other bots.

### Configuration

Create a new TwitchTV account for your bot. Preferably, the username should make
it clear to your viewers that the account is a bot.

Then, create the file `src/config.coffee` and paste the below snippet. Update
the values with the bot's account credentials. The channel name should be the
username of your streaming account.

``` coffeescript
exports.bot =
  username: 'Gmanbot'
  password: 'password123'
  channel: ["#guardsmanbob"]
```

This file does not come with nwitch by default in order to prevent accidental
committing of credentials to the git repository.

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

You will then find nwitch's dashboard by going to <http://localhost:3001>. You
can change the port in `nwitch.js`.

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
multiple instances of nwitch.

### How do I know nwitch doesn't transmit the bot's account credentials to you?

No, but why should you take my word for it? Simply read through source code.

### Isn't it dangerous to store the account credentials in plaintext?

Yes, and this will hopefully change in the future. If an attacker did get the
credentials, there isn't a whole lot they could do with it anyways.

### Is there a hosted version?

No; nwitch was conceived as a self-hosted bot. There is no reason to have a
hosted version that runs 24/7, because the features it provides are only useful
while you're streaming.

## Contributing

See `CONTRIBUTING.md` for guidelines on contributions

## License

MIT, see `LICENSE.md`.