var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');

gulp.task('minify-js', function(cb) {
	var files = [
	    'src/main/resources/static/**/*.js', 
	    '!src/main/resources/static/vendor/**',
	    '!src/main/resources/static/**/*.min.js'
    ];
	
	pump([
	      gulp.src(files),
	      uglify(),
	      rename({ suffix: '.min' }),
	      gulp.dest('./src/main/resources/static/dist')
      ],
      cb
	);
});

gulp.task('minify-css', function(cb) {
	var files = [
 	    'src/main/resources/static/**/*.css', 
 	    '!src/main/resources/static/vendor/**',
 	    '!src/main/resources/static/**/*min.css'
     ];
	
	pump([
	      gulp.src(files),
	      cleanCSS(),
	      rename({ suffix: '.min' }),
	      gulp.dest('./src/main/resources/static/dist')
      ],
      cb
	);
});

gulp.task('minify',['minify-js', 'minify-css'], function(){});