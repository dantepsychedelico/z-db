'use strict';

let gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    glob = require('glob'),
    path = require('path'),
    defaultTasks = ['watch', 'devServe'];

gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

gulp.task('test', ['env:test', 'build'], function () {
    let ignore = ['node_modules/', 'lib/', 'gulp/'];
    let argvMode = process.argv[3] || '-a';
    if (argvMode === '-i') {
        return $.nodemon({
            exec: `./node_modules/.bin/mocha -b`,
            script: process.argv[4],
            ext: 'html ts js json',
            env: { 
                'NODE_ENV': 'test', 
            },
            ignore 
        });
    } else if (argvMode === '-a') {
        let files = glob.sync('test/**/*.js');
        return $.nodemon({
            exec: `./node_modules/.bin/mocha -b ${files.join(' ')}`,
            ext: 'html ts js json',
            env: { 
                NODE_ENV: 'test'
            },
            ignore
        });
    } else {
        throw new Error('argv Error');
    }
});

