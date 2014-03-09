var path = require('path');
var Builder = require('component-builder');
var fs = require('graceful-fs');

var builder = new Builder(process.cwd());

var jsPath = path.join('public', 'build.js');
var cssPath = path.join('public', 'build.css');

builder.copyAssetsTo('public');

builder.build(function(error, obj) {
  if (error) throw error;
  var css = obj.css.trim();
  var js = obj.require + obj.js;
  fs.writeFileSync(jsPath, js);
  fs.writeFileSync(cssPath, css);
});