var gulp = require('gulp');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var def = require('del');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var maps = require('gulp-sourcemaps');
var assign = require('lodash');

var path = {
	scripts: ['server/**/*.js', 'client/**/*.js'],
  html: ['client/**/*.html'],
  dest: ['dest']
};


/*##############
  # BROWSERIFY #
  ##############
 */
var customOpts = {
  // entries: ['./node_modules/', './client/script', './client/templates'],
  entries: ['./server/bundle.js'],
  debug: true
};


gulp.task('lint', function() {
	return gulp.src(path.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
});

// gulp.task('html', function(){
//   return gulp.src(path.html)
//   .pipe(prettify({indent_char: ' ', indent_size:2}))
//   .pipe(gulp.dest('./dest/'))
// })

gulp.task('scripts', function() {
	gulp.watch(path.scripts,['lint']);
});

// gulp.task('process-style', function() {
// 	return gulp.src('main.css')
// 		.pipe(sass({style: 'expanded'}))
// 		.pipe(autoprefixer('last 2 version'))
// 		.pipe(gulp.dest('dest/styles/'))
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe
// 	})

// gulp.task('process-scripts', function() {
// 	return gulp.src('src/srcipts/*.js')
// 		.pipe(concat('main.js'))
// 		.pipe(uglify())

// 	})

gulp.task('default',function() {
	gutil.log('I have configured a gulpfile');
});

gulp.task('angular',function() {
	return gulp.src( ['./node_modules/angular/angular.min.js',
		'./node_modules/angular-ui-router/release/angular-ui-router.min.js'])
    .pipe(maps.init())
    .pipe(concat('angularApp.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./client/dist/js/'));
});