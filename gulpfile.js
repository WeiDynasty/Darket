var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var requireDir = require('require-dir');
requireDir('gulptasks');


gulp.task('watch', function(){
	livereload.listen()
	gulp.watch('components/*.jsx', ['market']);
});
gulp.task('default', ['market']);