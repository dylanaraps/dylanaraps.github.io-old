var gulp         = require('gulp');
var save         = require('gulp-save');
var rename       = require('gulp-rename');
var sitemap      = require('gulp-sitemap');
var fileinclude  = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var concatcss    = require('gulp-concat-css');
var cleancss     = require('gulp-clean-css');
var sass         = require('gulp-sass');
var uncss        = require('gulp-uncss');
var imagemin     = require('gulp-imagemin');
var mozjpeg      = require('imagemin-mozjpeg');
var pngquant     = require('imagemin-pngquant');
var browsersync  = require('browser-sync').create();
var exec         = require('child_process').exec;
var reload       = browsersync.reload;

gulp.task('html', function() {
    gulp.src(['./src/**/*.html', '!./src/includes/*.html'], {read: false})
        .pipe(save('before-sitemap'))
        .pipe(rename({extname: ''}))
        .pipe(sitemap({
            siteUrl: 'https://dylanaraps.com',
            changefreq: 'daily'
        }))
        .pipe(gulp.dest('./'))
        .pipe(save.restore('before-sitemap'))
        .pipe(fileinclude({
           prefix: '@@',
           basepath: '@file',
           indent: true
        }))
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
});

gulp.task('img', function() {
    gulp.src(['src/images/**/*.png', 'src/images/**/*.PNG'])
        .pipe(imagemin([pngquant({quality: 0-72})]))
        .pipe(gulp.dest('./img'));

    gulp.src(['src/images/**/*.jpg'])
        .pipe(imagemin([mozjpeg({progressive: true, quality: 90})]))
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./img'));
});

gulp.task('sitemap', function() {
    gulp.src('./sitemap.xml')
        exec('sed -ie s/index// sitemap.xml');
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['html']).on("change", reload);
	gulp.watch('src/templates/*.html', ['html']).on("change", reload);
	gulp.watch('src/scss/**/*.scss', ['css']);
	gulp.watch('src/images/**/*', ['img']);
	gulp.watch('./sitemap.xml', ['sitemap']);
});

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

gulp.task('default', ['html', 'css', 'img', 'sitemap', 'watch', 'browser-sync']);
