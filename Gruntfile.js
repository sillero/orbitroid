var bower = require('bower');
var inquirer = require('inquirer');

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      game: {
        entry: './js/main.js',
        output: {
          path: './js',
          filename: 'main.build.js'
        }
      }
    },
    connect: {
      server: {
      options: {
        livereload: true
      }
      }
    },
    watch: {
      livereload: {
        files: ['index.html', './js/main.build.js'],
        options: {
          livereload: true
        }
      },
      main: {
        files: ['./js/main.js', './js/game.js', './js/game.*.js'],
        tasks: ['webpack']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['bower', 'webpack', 'connect', 'watch']);

  grunt.registerTask('bower', function(){
  var done = this.async();
  var bowerOptions = {
    directory: 'js/vendor',
    interactive: true
  };

  bower.commands
    .install(['fetch', 'three.js', 'dat-gui'], {}, bowerOptions)
    .on('log', function(log){
      grunt.log.ok('bower:', log.message);
    })
    .on('end', function(installed){
      installed = Object.keys(installed);

      if (installed.length) {
        installed = 'installed:' + installed.join(', ');
      }
      else {
        installed = 'no package installed';
      }

      grunt.log.ok(installed);
      done();
    })
    .on('error', function(error){
      grunt.log.error(error);
      done(error);
    })
    .on('prompt', function(prompt, callback){
      grunt.log.ok(prompt);
      inquirer.prompt(prompts, callback);
    });

  });
};
