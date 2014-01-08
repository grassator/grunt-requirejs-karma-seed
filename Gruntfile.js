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

    // Task configuration.
    bower: {
      install: {
        options: {
          cleanup: true,
          targetDir: '<%= paths.vendor %>'
        }
      }
    },

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
      },
      ci: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      unit: {
        reporters: ['progress']
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

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: ['<%= paths.src %>/**/*.js'],
        tasks: ['jshint:src', 'jasmine']
      },
      test: {
        files: ['test/**/*.js'],
        tasks: ['jshint:test', 'jasmine']
      },
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          mainConfigFile: '<%= paths.src %>/config.js',
          include: ['../<%= paths.vendor %>/almond/almond.js'],
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
          keepalive: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'karma:ci', 'clean', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('server', ['connect:development']);
  grunt.registerTask('test', ['karma:ci']);
};
