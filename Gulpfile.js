/* jshint -W015 */
var gulp = require('gulp');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var runSequence = require('run-sequence');
var fs = require('fs');

var paths = {
	dev : {
		js : './static/js/*.js',
		css : './static/css/*.less',
		img : './static/images/*',
		libs : './libs/*',
		views : './views/*',
		icons : './icons/*',
		locales : './_locales/**',
		manifest : './manifest.json'
	},
	dist : {
		js : './dist/static/js/',
		css : './dist/static/css/',
		img : './dist/static/images/',
		libs : './dist/libs/',
		views : './dist/views/',
		icons : './dist/icons/',
		locales : './dist/_locales/',
		manifest : './dist/manifest.json'
	}
};


/** __________________________________________
 * JSHint
 */
gulp.task('jshint', function() {
	return gulp.src(paths.dev.js)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

/** __________________________________________
 * uglify
 */
gulp.task('clean-js', function() {
	return gulp.src(paths.dist.js)
		.pipe(clean());
});
gulp.task('uglify', ['clean-js'], function() {
	return gulp.src(paths.dev.js)
		.pipe(uglify({
			output: {
				beautify: false,
				indent_level: 0,
				ascii_only: true
			}
		}))
		.pipe(gulp.dest(paths.dist.js))
});

/** __________________________________________
 * less
 */
gulp.task('clean-less', function() {
	return gulp.src(paths.dist.css)
		.pipe(clean());
});
gulp.task('less',['clean-less'], function() {
	return gulp.src(paths.dev.css)
		.pipe(less({
			compress: true
		}))
		.pipe(gulp.dest(paths.dist.css));
});

/** __________________________________________
 * copy-img
 */
gulp.task('clean-img', function() {
	return gulp.src(paths.dist.img)
		.pipe(clean());
});
gulp.task('copy-img' , ['clean-img'], function() {
	return gulp.src('./static/images/*')
		.pipe(gulp.dest(paths.dist.img));
});

/** __________________________________________
 * copy-views
 */
gulp.task('clean-views', function() {
	return gulp.src(paths.dist.views)
		.pipe(clean());
});
gulp.task('copy-views', ['clean-views'], function() {
	return gulp.src(paths.dev.views)
		.pipe(gulp.dest(paths.dist.views));
});

/** __________________________________________
 * copy-libs
 */
gulp.task('clean-libs', function() {
	return gulp.src(paths.dist.libs)
		.pipe(clean());
});
gulp.task('copy-libs', ['clean-libs'], function() {
	return gulp.src(paths.dev.libs)
		.pipe(gulp.dest(paths.dist.libs));
});

/** __________________________________________
 * copy-icons
 */
gulp.task('copy-icons', function() {
	return gulp.src(paths.dev.icons)
		.pipe(gulp.dest(paths.dist.icons));
});

/** __________________________________________
 * copy-locales
 */
gulp.task('copy-locales', function() {
	return gulp.src(paths.dev.locales)
		.pipe(gulp.dest(paths.dist.locales));
});

/** __________________________________________
 * copy-manifest
 */
gulp.task('clean-manifest', function() {
	return gulp.src(paths.dist.manifest)
		.pipe(clean());
});
gulp.task('copy-manifest' , ['clean-manifest'], function() {
	return gulp.src(paths.dev.manifest)
		.pipe(gulp.dest('./dist/'));
});


gulp.task('watch', function() {
	gulp.watch(paths.dev.js,['jshint','uglify']);
	gulp.watch(paths.dev.css,['less']);
	gulp.watch(paths.dev.img,['copy-img']);
	gulp.watch(paths.dev.libs,['copy-libs']);
	gulp.watch(paths.dev.views,['copy-views']);
	gulp.watch(paths.dev.icons,['copy-icons']);
	gulp.watch(paths.dev.locales,['copy-locales']);
	gulp.watch(paths.dev.manifest,['copy-manifest']);
});

gulp.task('default', function(cb) {
	runSequence([
			'jshint',
			'uglify',
			'less',
			'copy-img',
			'copy-libs',
			'copy-views',
			'copy-icons',
			'copy-locales',
			'copy-manifest'
		],
		cb);
});