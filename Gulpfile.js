/* jshint -W015 */
const gulp = require('gulp');
const clean = require('gulp-clean');
const watch = require('gulp-watch');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const fs = require('fs');

const paths = {
  dev: {
    js: './static/js/**/*.js',
    css: './static/css/**/*.less',
    copy: [
      './static/images/**/*',
      './static/css/lib/**/*',
      './libs/**/*',
      './views/**/*',
      './icons/**/*',
      './_locales/**/*',
      './manifest.json'
    ]
  },
  dist: {
    default: './dist/',
    js: './dist/static/js/',
    css: './dist/static/css/'
  }
};

/** __________________________________________
 * clean
 */
gulp.task('clean', function() {
  return gulp.src(paths.dist.default)
    .pipe(clean());
});

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
gulp.task('copy-js', function() {
  return gulp.src(paths.dev.js)
    .pipe(gulp.dest(paths.dist.js))
});
gulp.task('uglify', function() {
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
gulp.task('less', function() {
  return gulp.src(paths.dev.css)
    .pipe(less({
      compress: true
    }))
    .pipe(gulp.dest(paths.dist.css));
});

/** __________________________________________
 * copy
 */
gulp.task('copy', function() {
  return gulp.src(paths.dev.copy, { base: './' })
    .pipe(gulp.dest(paths.dist.default));
});


gulp.task('default', gulp.series('clean', 'uglify', 'less', 'copy', function(cb) {
  return Promise.resolve('编译完成');
}));


gulp.task('watch', gulp.series('default', function() {
  gulp.watch(paths.dev.js, [ /*'jshint',*/ 'copy-js']);
  gulp.watch(paths.dev.css, ['less']);
  gulp.watch(paths.dev.copy, ['copy']);
}));