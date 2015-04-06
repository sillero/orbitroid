var bower = require('bower');

module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          livereload: true
        }
      }
    },
    watch: {
      livereload: {
        files: '**/*',
        tasks: [],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bower', 'connect', 'watch']);

  grunt.registerTask('bower', function(){
    var done = this.async();

    bower.commands
      .install(['fetch'], {}, { directory: 'js/vendor' })
      .on('end', function(installed){
          done();
      });
  });
};
