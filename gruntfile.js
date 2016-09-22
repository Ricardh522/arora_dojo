module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-dojo');
    require('load-grunt-tasks')(grunt, {pattern: 'grunt-contrib-*'});

  grunt.initConfig({

    clean: {
      build: {
        src: ['dist/']
      },
      uncompressed: {
        src: [
          'dist/**/*.uncompressed.js'
        ]
      },
      django: {
        options: {
          force: true
        },
        src: ['../arora/arora/home/static/home/app/', '../arora/arora/home/static/home/dojo/',
        '../arora/tests/unit/']
      }
    },

    copy: {
        main: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['built.html'],
                dest: './dist/',
                rename: function (dest, src) {
                    return dest + 'index.html';
                }
            }]
        },
        django: {
          files: [{
            expand: true,
            cwd: 'dist/',
            src: ['app/img/**', 'app/resources/**', 'dojo/resources/**', 'dojo/dojo.js'],
            dest: '../arora/arora/home/static/home/'
          }, {
            expand: true,
            cwd: 'tests',
            src: ['unit/**'],
            dest: '../arora/tests/'
          }]
        }
    },
    dojo: {
      dist: {
          options: {
              releaseDir: '../dist'
          }
      },
      options: {
          profile: 'build.profile.js',
          dojo: 'src/dojo/dojo.js',
          load: 'build',
          cwd: './',
          basePath: './src'
        }
    },
    uglify: {
      build: {
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.js',
            dest: 'dist/'
        }]
      }
    },
    watch: {
      main: {
        files: ['src/app/**/*.js', 'src/**/*.html',
      'src/app/**/*.styl'],
        tasks: ['stylus:compile', 'jshint']
      }
    },

    stylus: {
      compile: {
        options: {
          compress: false,
          'import': [ 'nib']
        },
        use: [
          require('autoprefixer-stylus')
        ],
        files: [{
          './src/app/resources/app.css': [
            './src/app/resources/app.styl'
          ]
        }]
      }
    },

    jshint : {
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        dojo: true
      },

      all: ['gruntfile.js', './src/app/**/*.js', './tests/**/*.js']
    },

    connect: {
			options: {
				port: 3000,
				hostname: 'localhost'
			},
      dev: {
        options: {
          base: './src',
          open: {
            target: 'http://localhost:3000/index.html'
          }
        }
      },
        test: {
            options: {
              base: '.',
              open: {
                target: 'http://localhost:3000/node_modules/intern/client.html?config=tests/intern'
              }
            }
        },
        dist: {
            options: {
                base: './dist',
                open: {
                  target: 'http://localhost:3000/index.html'
                },
                keepalive: true
            }
        }
    },

    intern: {
			local: {
				options: {
					runType: 'client',
					config: 'tests/intern'
				}
			},
			remote: {
				options: {
					runType: 'runner',
					config: 'tests/intern'
				}
			}
		}
  });

  grunt.registerTask('build', ['stylus:compile', 'jshint', 'clean:build', 'dojo', 'copy:main', 'clean:uncompressed',
    'clean:django', 'copy:django', 'connect:dist']);
  grunt.registerTask('default', ['stylus:compile', 'jshint', 'connect:dev', 'watch']);
  grunt.registerTask('test', ['stylus:compile', 'jshint', 'connect:test', 'watch']);
};
