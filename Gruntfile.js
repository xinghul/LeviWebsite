"use strict";

module.exports = function(grunt){ 
    // load plugins
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // configure plugins
    grunt.initConfig({
        express: {
            options: {
                port: process.env.PORT || 3001
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            },
            prod: {
                options: {
                    script: 'server.js',
                    node_env: 'production'
                }
            }
        },
        open: {
            server: {
                url: "http://localhost:<%= express.options.port %>",
                app: "Google Chrome"
            }
        },
        watch: {
            express: {
                files: [
                    "server.js",
                    "lib/{,*/}*.js",
                    "routes/{,*/}*.js",
                    "app/javascripts/{,*/}*.js"
                ],
                tasks: ["express:dev"],
                options: {
                    nospawn: true //Without this option specified express won't be reloaded
                }
            },
            jade: {
                files: ["build/jade/**/*.jade"],
                tasks: ["jade"],
            },
            sass: {
                files: ["build/sass/**/*.scss"],
                tasks: ["sass"],
            }
        },
        concurrent: {
            build: [
                "jade",
                "sass"
            ]
        },
        cafemocha: {
            all: { 
                src: 'qa/tests-*.js', 
                options: { 
                    ui: 'tdd' 
                }, 
            }
        }, 
        jshint: {
            app: [
                'app.js', 
                'app/javascripts/**/*.js',
                'lib/**/*.js'
            ],
            qa: [
                'Gruntfile.js', 
                'app/qa/**/*.js', 
                'qa/**/*.js'
            ],
        },
        exec: {
            // linkchecker: { 
            //     cmd: 'linkchecker http://localhost:3001' 
            // }
        }, 
        jade: {
            compile: {
                options: {
                    compileDebug: false,
                    pretty: true,
                },
                files: [ {
                    expand: true,
                    cwd: "build/jade",
                    src: "**/*.jade",
                    dest: "app/views",
                    ext: ".html"
                } ]
            }
        },
        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: "expanded"
                },
                files: [ {                         // Dictionary of files
                    expand: true,
                    cwd: "build/sass",
                    src: ["**/*.scss"],
                    dest: "app/stylesheets",
                    ext: ".css"
                } ]
            }
        }
    });

    // register tasks
    grunt.registerTask("build", ["concurrent:build"]);

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            // 'clean:server',
            'concurrent:build',
            // 'autoprefixer',
            'express:dev',
            'open',
            'watch'
        ]);
    });
};