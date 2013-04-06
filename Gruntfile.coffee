docco = require 'docco'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      src:
        options:
          bare: true
        expand: true
        cwd: './src/'
        src: ['*.coffee']
        dest: './lib/'
        ext: '.js'
    uglify:
      options:
        compress:
          comparisons: false,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        beautify:
          ascii_only: true
          max_line_len: 500
      lib:
        files: [
          expand: true
          cwd: './lib/'
          src: ['*.js']
          dest: './lib/'
          ext: '.js'
        ]

  grunt.registerTask 'doc', 'Documents.', () ->
    docco.document @options(args: ['./src/*.coffee']), @async()

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.registerTask 'min', ['uglify']
  grunt.registerTask 'default', ['coffee']