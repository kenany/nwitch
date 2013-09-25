var express = require('express');
var passport = require('passport');
var TwitchTVStrategy = require('passport-twitchtv').Strategy;
var gzippo = require('gzippo');
var ms = require('ms');

var server = require('./server');

passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

function App(config) {
  this.config = config;

  var viewsPath = __dirname + '/../../views';
  var publicPath = __dirname + '/../../public';

  var gzipCacheAge = ms(config.server.cacheAge);

  var dasboardURL = 'http://localhost:' + config.server.port;

  // passport.use(new TwitchTVStrategy({
  //     clientID: config.twitchtv.id,
  //     clientSecret: config.twitchtv.secret,
  //     callbackURL: dasboardURL + '/auth/twitchtv/callback'
  //   },
  //   function(accessToken, refreshToken, profile, callback) {
  //     process.nextTick(function() {
  //       return callback(null, profile);
  //     });
  //   }
  // ));

  this.app = express();

  this.app
    .set('view engine', 'jade')
    .set('views', viewsPath)
    .use(require('express-uncapitalize')())
    .use(gzippo.staticGzip(publicPath, {maxAge: gzipCacheAge}))
    .use(express.compress())
    .use(express.cookieParser())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(passport.initialize())
    .use(passport.session())
    .use(this.app.router);

  var chatEmbed = 'http://www.twitch.tv/chat/embed?channel=';
  chatEmbed += config.account.channel + '&popout_chat=true';

  this.app.get('/', function(req, res) {
    res.render('index.jade', {
      user: req.user,
      embed: chatEmbed
    });
  });

  this.app.get('/auth/twitchtv',
    passport.authenticate('twitchtv', {scope: ['user_read']}),
    function(req, res) {}
  );

  this.app.get('/auth/twitchtv/callback',
    passport.authenticate('twitchtv', {failureRedirect: '/'}),
    function(req, res) {
      res.redirect('/');
    }
  );
}

App.prototype.spawn = function() {
  server.run(this.config.server.port, this.app);
};

module.exports = App;