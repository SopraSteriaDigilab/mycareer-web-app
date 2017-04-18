var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");

gulp.task('minify', function(cb) {
  var files = 'src/main/resources/static/components/**/*.js'; // matches multiple files
  pump([
  		gulp.src(files),
  		uglify(),
  		rename({ suffix: '.min' }),
  		gulp.dest('./src/main/resources/static/dist')
  	],
  	cb
	);
});