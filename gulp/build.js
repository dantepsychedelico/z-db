'use strict';

let gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    outDir = './lib';

gulp.task('clean', function() {
    let tsProj = $.typescript.createProject('tsconfig.json');
    return del(outDir);
});

gulp.task('build', ['clean'], function () {
    let tsProj = $.typescript.createProject('tsconfig.json');
    return gulp.src('./src/**/*.ts')
        .pipe(tsProj())
        .js
        .pipe(gulp.dest(outDir))
});
