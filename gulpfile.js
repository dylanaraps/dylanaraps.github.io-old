var gulp         = require('gulp');
var pandoc       = require('gulp-pandoc');
var minifyhtml   = require('gulp-minify-html');
var autoprefixer = require('gulp-autoprefixer');
var concatcss    = require('gulp-concat-css');
var cleancss     = require('gulp-clean-css');
var sass         = require('gulp-sass');
var uncss        = require('gulp-uncss');
var imagemin     = require('gulp-imagemin');
var mozjpeg      = require('imagemin-mozjpeg');
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

gulp.task('img', function() {
    gulp.src(['src/images/**/*'])
        .pipe(imagemin([mozjpeg({progressive: true, quality: 90})]))
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./img'))
})

gulp.task('watch', function() {
	gulp.watch('src/**/*.md', ['html']).on("change", reload);
	gulp.watch('src/templates/*.html', ['html']).on("change", reload);
	gulp.watch('src/scss/**/*.scss', ['css'])
	gulp.watch('src/images/**/*', ['img'])
})

gulp.task('browser-sync', function() {
    browsersync.init({
        server: {
            baseDir: "./",
            serveStaticOptions: {
                extensions: ['html']
            }
        }
    });
});

gulp.task('default', ['html', 'css', 'img', 'watch', 'browser-sync'])
