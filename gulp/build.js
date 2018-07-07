'use strict';

let gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')();

gulp.task('clean', function() {
    let tsProj = $.typescript.createProject('tsconfig.json');
    return del(tsProj.options.outDir);
});

gulp.task('build', ['clean'], function () {
    let tsProj = $.typescript.createProject('tsconfig.json');
    return tsProj.src()
        .pipe(tsProj())
        .js
        .pipe(gulp.dest(tsProj.options.outDir))
});
