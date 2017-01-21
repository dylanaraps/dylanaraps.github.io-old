var gulp         = require('gulp');
var pandoc       = require('gulp-pandoc');
var minifyhtml   = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var concatcss    = require('gulp-concat-css');
var cleancss     = require('gulp-clean-css');
var sass         = require('gulp-sass');
var uncss        = require('gulp-uncss');
var browsersync  = require('browser-sync').create();
var reload       = browsersync.reload;

gulp.task('html', function() {
  gulp.src('./src/**/*.md')
    .pipe(pandoc({
      from: 'markdown',
      to: 'html5',
      ext: '.html',
      args: ['--smart', '--template=src/templates/post.html']
    }))
    .pipe(minifyhtml())
    .pipe(gulp.dest('./'));
});

gulp.task('css', function() {
    gulp.src(['./src/scss/*.scss'])
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: 'last 2 versions', cascade: false}))
        .pipe(concatcss('style.css'))
        .pipe(uncss({html: ['*.html', 'pages/*.html', 'pages/**/*.html']}))
        .pipe(cleancss({keepSpecialComments: 0}))
        .pipe(gulp.dest('./css'))
        .pipe(browsersync.stream());
})

gulp.task('watch', function() {
	gulp.watch('src/**/*.md', ['html']).on("change", reload);
	gulp.watch('src/scss/**/*.scss', ['css'])
})

gulp.task('browser-sync', function() {
    browsersync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', ['html', 'css', 'watch', 'browser-sync'])
