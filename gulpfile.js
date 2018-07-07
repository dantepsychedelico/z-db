'use strict';

let gulp = require('gulp'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'test';

fs.readdirSync('./gulp').filter((file) => { 
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file);
});

gulp.task('default', function () {
    gulp.start(env);
});
