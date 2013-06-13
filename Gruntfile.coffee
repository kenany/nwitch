path = require 'path'
Builder = require 'component-builder'

fs = undefined
try
  fs = require 'graceful-fs'
catch error
  fs = require 'fs'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean:
      lib: './lib/'
    coffee:
      src:
        options:
          bare: true
        expand: true
        cwd: './src/'
        src: ['**/*.coffee']
        dest: './lib/'
        ext: '.js'
    uglify:
      options:
        report: 'min'
        beautify:
          ascii_only: true
          max_line_len: 500
        compress:
          comparisons: false
          unsafe: true
          unsafe_comps: true
          warnings: false
      lib:
        files: [
          expand: true
          cwd: './lib/'
          src: ['**/*.js']
          dest: './lib/'
          ext: '.js'
        ]
    watch:
      src:
        options:
          interrupt: true
        files: [
          './src/**/*'
        ]
        tasks: 'coffee'

  grunt.registerTask 'comp', 'Component compile', ->
    done = @async();
    builder = new Builder process.cwd()
    jsPath = path.join 'public', 'build.js'
    cssPath = path.join 'public', 'build.css'

    builder.copyAssetsTo 'public'

    builder.build (error, obj) ->
      grunt.fail.fatal(error.message) if error

      js = ''
      css = obj.css.trim()

      js += obj.require
      js += obj.js

      grunt.util.async.series [
        (callback) ->
          fs.writeFile jsPath, js, callback
        (callback) ->
          fs.writeFile cssPath, css, callback
      ], done

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', ['clean', 'coffee', 'comp']
  grunt.registerTask 'min', ['build', 'uglify']
  grunt.registerTask 'default', ['build']