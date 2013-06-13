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

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'build', ['clean', 'coffee']
  grunt.registerTask 'min', ['build', 'uglify']
  grunt.registerTask 'default', ['build']