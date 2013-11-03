var path = require('path');
var Builder = require('component-builder');
var fs = require('graceful-fs');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('comp', 'Component compile', function() {
    var done = this.async();

    var builder = new Builder(process.cwd());

    var jsPath = path.join('public', 'build.js');
    var cssPath = path.join('public', 'build.css');

    builder.copyAssetsTo('public');

    builder.build(function(error, obj) {
      if (error) grunt.fail.fatal(error.message);
      var css = obj.css.trim();
      var js = '';
      js += obj.require;
      js += obj.js;
      grunt.util.async.series([
        function(callback) {
          fs.writeFile(jsPath, js, callback);
        }, function(callback) {
          fs.writeFile(cssPath, css, callback);
        }
      ], done);
    });
  });

  grunt.registerTask('build', ['comp']);
  grunt.registerTask('default', ['build']);
};