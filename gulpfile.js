var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["frontend/**/*.*", "node_modules/phaser/dist/*"],
    browser: "chrome",
    port: 7000,
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'index.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ],
    env: {
      PORT: 3000
    },
  })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      reload({ stream: false });
    });
});

gulp.task('dev', ['browser-sync'], function () {
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('frontend/**/*.js', reload);
});
