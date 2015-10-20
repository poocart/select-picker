'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var mainBowerFiles = require('main-bower-files');

var LessPluginCleanCSS = require("less-plugin-clean-css"),
    cleancss = new LessPluginCleanCSS({advanced: true});

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

gulp.task('css:big', function() {
    return gulp.src('css/picker.less')
        .pipe(plugins.less({
            plugins: [autoprefix]
        }))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.rename('picker.css'))
        .pipe(gulp.dest('css/'))
        .pipe(plugins.notify('CSS build finished'));
});

gulp.task('css:min', function() {
    return gulp.src('css/picker.less')
        .pipe(plugins.less({
            plugins: [autoprefix, cleancss]
        }))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.rename('picker.min.css'))
        .pipe(gulp.dest('css/'))
        .pipe(plugins.notify('CSS:min build finished'));
});

gulp.task('js:min', function() {
    return gulp.src('js/picker.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('picker.min.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('doc:js', function() {
    return gulp.src(mainBowerFiles({'includeDev': true}))
        .pipe(plugins.ignore.include('*.js'))
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.concat('libs.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('doc/js/'));
});

gulp.task('doc:css', function() {
    return gulp.src('doc/css/main.less')
        .pipe(plugins.less({
            plugins: [autoprefix, cleancss]
        }))
        .pipe(plugins.addSrc.prepend(mainBowerFiles({'includeDev': true})))
        .pipe(plugins.ignore.include('*.css'))
        .pipe(plugins.minifyCss())
        .on('error', plugins.notify.onError("Error: <%= error.file %> <%= error.message %>"))
        .pipe(plugins.concat('main.css'))
        .pipe(gulp.dest('doc/css/'))
        .pipe(plugins.notify('Examples:css build finished'));
});

gulp.task('css', ['css:big', 'css:min']);
gulp.task('doc', ['doc:css', 'doc:js']);

gulp.task('build', ['examples', 'css', 'js:min']);

gulp.task('doc:watch', ['doc'], function () {
    gulp.watch('doc/css/main.less', ['doc:css']);
});

gulp.task('default', ['css'], function() {
    gulp.watch('css/picker.less', ['css:big']);
});