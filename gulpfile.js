var gulp = require('gulp'),
  gulp_copy = require('gulp-copy'),
  gulp_typescript = require('gulp-typescript'),
  gulp_sourceMaps = require('gulp-sourcemaps'),
  gulp_clean = require('gulp-clean'),
  fs = require('fs');

gulp.task('clean', function() {
  return gulp.src('./dist').pipe(gulp_clean({ force: true }));
});

gulp.task('create-index', function(done) {
  function createIndex(path) {
    var files = fs.readdirSync(path);
    var index = '';
    files.forEach(file => {
      var stats = fs.statSync(path + '/' + file);
      var name = file;
      if (stats.isDirectory()) {
        createIndex(path + '/' + file);
      } else {
        if (
          !/\.ts$/gi.test(name) ||
          /\.spec\.ts$/gi.test(name) ||
          /test.ts$/gi.test(name)
        ) {
          return;
        }
        name = name.replace(/\.ts$/g, '');
        if (name === 'index') return;
      }

      index += `export * from \'./${name}\';\r\n`;
    });
    fs.writeFileSync(path + '/index.ts', index);
  }

  createIndex('./src');
  done();
});

gulp.task('build', ['clean', 'create-index'], function() {
  //loading typings file
  var tsProject = gulp_typescript.createProject('./tsconfig.json');

  return gulp
    .src('./src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp_sourceMaps.init())
    .pipe(gulp_sourceMaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(
      gulp
        .src([
          'package.json',
          '{README,readme}?(.md)',
          '{LICENSE|license}?(.md)'
        ])
        .pipe(gulp_copy('./dist/'))
    );
});
