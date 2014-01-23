'use strict';

module.exports = function (grunt) {

  var pkg = grunt.file.readJSON('package.json'),
      fullPkg = grunt.file.readJSON('bower.json'),
      paths = grunt.file.readJSON('paths.json');

  // merging all package.json and bower.json together
  Object.getOwnPropertyNames(pkg).forEach(function(name){
    fullPkg[name] = pkg[name];
  });
    
  // This will go through package.json and load grunt task
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    paths: paths,
    pkg: fullPkg,
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    clean: {
      files: ['<%= paths.dist %>']
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= paths.dist %>/main.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= paths.dist %>/main.min.js'
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
        autoWatch: false // true doesn't work with esteWatch 
      },
      ci: {
        singleRun: true
      },
      unit: {
        background: true
      }
    },

    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '<%= paths.src %>/.jshintrc'
        },
        src: ['<%= paths.src %>/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },

    esteWatch: {
      options: {
        dirs: [paths.src, 'test', 'examples'],
        livereload: {
          enabled: true,
          port: 35729,
          extensions: ['html', 'js', 'css']
        }
      },
      js: function(filepath) {
        var tasks = [];
        if(filepath.indexOf(paths.src) === 0) {
          grunt.config(['jshint:src'], filepath);
          tasks.push('jshint:src');
        } else if (filepath.indexOf('test') === 0) {
          grunt.config(['jshint:test'], filepath);
          tasks.push('jshint:test');
        }
        tasks.push('karma:unit:run');
        return tasks;
      },
    },

    requirejs: {
      compile: {
        options: {
          name: 'rjs-shim',
          mainConfigFile: '<%= paths.src %>/config.js',
          include: ['main'],
          insertRequire: ['main'],
          logLevel: 2, // WARN
          out: '<%= concat.dist.dest %>',
          optimize: 'none',
          wrap: true
        }
      }
    },

    connect: {
      development: {
        options: {
          base: ['<%= paths.src %>', '<%= paths.vendor %>', 'examples'],
          livereload: '<%= esteWatch.options.livereload.port %>',
          open: true
        }
      }
    }
  });

  grunt.registerTask('js', ['requirejs', 'concat', 'uglify']);
  grunt.registerTask('watch', ['karma:unit:start', 'esteWatch']);
  grunt.registerTask('test', ['karma:ci']);
  grunt.registerTask('default', ['jshint', 'test', 'clean', 'js']);
  grunt.registerTask('server', ['connect', 'watch']);
};
