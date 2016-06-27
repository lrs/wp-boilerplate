const gulp         = require('gulp')
const concat       = require('gulp-concat')
const gulpIf       = require('gulp-if')
const jade         = require('gulp-jade-php')
const sass         = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csslint      = require('gulp-csslint')
const cssnano      = require('gulp-cssnano')
const babel        = require('gulp-babel')
const eslint       = require('gulp-eslint')
const uglify       = require('gulp-uglify')
const maps         = require('gulp-sourcemaps')
const webstandards = require('gulp-webstandards')
const gutil        = require('gulp-util')
const replace      = require('gulp-replace')
const notifier     = require('node-notifier')

// Vars
const publishPath = "path/to/local/theme/folder";

const jadeOptions = {
  pretty: !gutil.env.dist
}

const sassOptions = {
  outputStyle : 'expanded'
}
const autoPrefixOptions = {
  browsers: ['last 2 versions'],
  cascade: false
}

const babelOptions = {
  compact: false
}
const uglifyOptions = {
  mangle: true,
  compress: {
    drop_console: true,
    drop_debugger: true
  }
}

// You should only uncomment scripts that will be used
const jsConcat = [
  // './bower_components/tether/dist/js/tether.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
  './bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
  './bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
  // './bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
  './bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
  './src/js/tools.js'
]

// Utils
const notify = (error) => {
  'use strict';

  let message = 'In: ',
    title = 'Error: '

  if (error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message
  }

  if (error.filename) {
    let file = error.filename.split('/')
    message += file[file.length-1]
  }

  if (error.lineNumber) {
    message += '\nOn Line: ' + error.lineNumber
  }

  if (message === 'In: ') {
    message = error.stack
  }

  gutil.log(error)

  notifier.notify({
    title: title,
    message: message
  })
}

// Preprocess and optionally minimize ./src/sass/theme.scss -> ./dist/assets/css
gulp.task('sass', () => {
  gulp.src('./src/sass/theme.scss')
  .pipe(
    gulpIf(
      !gutil.env.dist,
      maps.init()
    )
  )
  .pipe(sass( sassOptions ).on('error', notify))
  .pipe(autoprefixer( autoPrefixOptions ).on('error', notify))
  .pipe(
    gulpIf(
      gutil.env.dist,
      cssnano()
    )
  )
  .pipe(
    gulpIf(
      !gutil.env.dist,
      maps.write('../maps').on('error', notify)
    )
  )
  .pipe(gulp.dest('./dist/assets/css'))
})

// transpile and optionally uglify ./src/js/theme.js -> ./dist/assets/js/theme.js
gulp.task('js', () => {
  gulp.src(jsConcat)
  .pipe(concat('theme.js'))
  .pipe(babel( babelOptions ).on('error', notify))
  .pipe(
    gulpIf(
      gutil.env.dist,
      uglify( uglifyOptions ).on('error', notify)
    )
  )
  .pipe(gulp.dest('./dist/assets/js/'))
})

// Preprocess ./src/jade/pages/*.jade -> dist/*.php
gulp.task('jade', () => {
  gulp.src('./src/jade/pages/*.jade')
  .pipe(jade( jadeOptions ).on('error', notify))
  .pipe(replace(/_+=\"(.*?)\"/g, '$1')) // fix to allow using multiples of _(underscores) to represent unnamed tag attributes.
  .pipe(gulp.dest('./dist'))

  gulp.src('./src/jade/template-parts/*.jade')
  .pipe(jade( jadeOptions ).on('error', notify))
  .pipe(replace(/_+=\"(.*?)\"/g, '$1')) // fix to allow using multiples of _(underscores) to represent unnamed tag attributes.
  .pipe(gulp.dest('./dist/template-parts/'))
})

// Watch for changes and run tasks.
gulp.task('watches', () => {
  gulp.watch('./src/sass/**/*.scss', ['sass'])
  gulp.watch('./src/js/**/*.js', ['js'])
  gulp.watch('./src/jade/**/*.jade', ['jade'])
})

// Copy static files
// js
gulp.task('static-js', () => {
  gulp.src('./src/static/js/*.js')
  .pipe(babel().on('error', notify))
  .pipe(uglify( uglifyOptions ).on('error', notify))
  .pipe(gulp.dest('./dist/assets/js/'))
})
// images
gulp.task('static-images', () => {
  gulp.src('./src/static/img/*.*')
  .pipe(gulp.dest('./dist/assets/img/'))
})
// pages
gulp.task('static-pages', () => {
  gulp.src('./src/static/pages/*.*')
  .pipe(gulp.dest('./dist/'))
})
// languages
gulp.task('static-lang', () => {
  gulp.src('./src/static/lang/*.*')
  .pipe(gulp.dest('./dist/languages/'))
})
// fonts
gulp.task('static-fonts', () => {
  gulp.src('./src/static/fonts/*.*')
  .pipe(gulp.dest('./dist/assets/fonts/'))
})
// combine
gulp.task('statics', ['static-js', 'static-images', 'static-pages', 'static-lang', 'static-fonts'], () => {})

// Optional checks.
// Lint CSS
gulp.task('csslint', () => {
  gulp.src(['./dist/assets/css/**/*.css', '!./dist/assets/css/main.css'])
  .pipe(csslint('.csslintrc').on('error', notify))
  .pipe(csslint.reporter())
})
// Lint JS
const isFixed = (file) => {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed
}
gulp.task('eslint', () => {
  gulp.src('./dist/assets/js/**/*.js')
  .pipe(eslint('.eslintrc.json', { fix: true }))
	.pipe(eslint.format())
  // if fixed, write the file to dest
	.pipe(
    gulpIf(
      isFixed,
      gulp.dest('./dist/assets/js')
    )
  )
})

// web standards check on compiled files
gulp.task('webstandards', () => {
  gulp.src(['./dist/**/*', '!./dist/**/main.*', '!./dist/**/fonts/*.*', '!./dist/**/*.txt'])
  .pipe(webstandards())
});

// Optional task to copy dist files/folders to an absolute path for publishing to local test site.
gulp.task('publish', () => {
  gulp.src('./dist/**/*.*')
  .pipe(gulp.dest( publishPath ))
})

gulp.task('build', ['jade', 'sass', 'js'], () => {})
gulp.task('checks', ['csslint', 'eslint', 'webstandards'], () => {})

if (gutil.env.dist) {
  gulp.task('default', ['jade', 'sass', 'js'], () => {})
} else {
  gulp.task('default', ['jade', 'sass', 'js', 'watches'], () => {})
}