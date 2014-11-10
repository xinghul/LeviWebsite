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
                tasks: ["newer:jade"],
            },
            sass: {
                files: ["build/sass/**/*.scss"],
                tasks: ["newer:sass"],
            }
        },
        concurrent: {
            build: [
                "newer:jade",
                "newer:sass"
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
        newer: {
            options: {
                cache: ".newer-cache",
                override: function(detail, include) {
                    if (detail.task === "sass") {
                        // console.log("!", detail);
                        checkForModifiedImports(detail.path, detail.time, include);
                    } else {
                        include(false);
                    }
                }
            }
        },
        sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: "expanded"
                },
                files: [ {                         // Dictionary of files
                    expand: true,
                    cwd  : "build/sass",
                    src  : ["**/*.scss"],
                    dest : "app/stylesheets",
                    ext  : ".css"
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

var fs = require('fs');
var path = require('path');
 
function checkForModifiedImports(lessFile, mTime, include) {
    fs.readFile(lessFile, "utf8", function(err, data) {
        var lessDir = path.dirname(lessFile),
            regex = /@import "(.+?)(\.scss)?";/g,
            shouldInclude = false,                
            match;
 
        while ((match = regex.exec(data)) !== null) {
            var tokens = match[1].split("/");
            tokens[tokens.length - 1] = "_" + tokens[tokens.length - 1];
            // All of my less files are in the same directory,
            // other paths may need to be traversed for different setups...
            var importFile = lessDir + '/' + tokens.join("/") + '.scss';
            // console.log("*", importFile);
            if (fs.existsSync(importFile)) {
                // console.log("*", "changed");
                var stat = fs.statSync(importFile);
                if (stat.mtime > mTime) {
                    shouldInclude = true;
                    break;
                }
            }
        }
        include(shouldInclude);
    });
}