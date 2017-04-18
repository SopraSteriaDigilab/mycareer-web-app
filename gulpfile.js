var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

gulp.task('minify-js', function(cb) {
  pump([
  		gulp.src('src/main/resources/static/components/**/*.js'),
  		uglify(),
  		rename({ suffix: '.min' }),
  		gulp.dest('./src/main/resources/static/dist')
  	],
  	cb
	);
});

gulp.task('minify-css', function(cb) {
  pump([
  		gulp.src('src/main/resources/static/components/**/*.css'),
  		cleanCSS(),
  		rename({ suffix: '.min' }),
  		gulp.dest('./src/main/resources/static/dist')
  	],
  	cb
	);
});

gulp.task('minify',['minify-js', 'minify-css'], function(){});