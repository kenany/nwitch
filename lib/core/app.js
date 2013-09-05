var path = require('path');
var express = require('express');
var gzippo = require('gzippo');
var ms = require('ms');

function App(config) {
  var root = path.dirname(__dirname);
  var publicPath = path.join(root, 'public');
  var viewsPath = path.join(root, 'views');

  var gzipCacheAge = ms(config.server.cacheAge);

  this.app = express();

  this.app
    .set('view engine', 'jade')
    .set('views', viewsPath)
    .use(require('express-uncapitalize')())
    .use(gzippo.staticGzip(publicPath, {
      maxAge: gzipCacheAge
    }))
    .use(express.compress())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(this.app.router);

  this.app.get('/', function(req, res) {
    res.render('index.jade', {
      embed: 'http://www.twitch.tv/chat/embed?channel=' + config.account.channel + '&popout_chat=true'
    });
  });
}

module.exports = App;