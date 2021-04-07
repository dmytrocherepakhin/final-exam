'use strict'
const gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssnano'),
    sourceMaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    babel = require('gulp-babel'),
    minify = require('gulp-minify'),
    webpack = require('webpack-stream');

var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function () {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});

const buildFolderName = './build/',
    srcFolderName = './src/';

const path = {
    build: {
        html: buildFolderName,
        js: buildFolderName + 'js/',
        css: buildFolderName + 'css/',
        images: buildFolderName + 'images/',
        fonts: buildFolderName + 'css/fonts/',
    },
    src: {
        html: srcFolderName + '[^_]*.html',
        js: srcFolderName + 'js/**/*.js',
        css: srcFolderName + 'css/**/*.{scss,css}',
        images: srcFolderName + 'images/**',
        fonts: srcFolderName + 'fonts/**',
    },
    watch: {
        html: srcFolderName + '**/*.html',
        js: srcFolderName + 'js/**/*.js',
        images: srcFolderName + 'images/**/*.{png,jpg,svg,gif}',
        css: srcFolderName + 'css/**/*.{scss,css}'
    },
    clean: buildFolderName
};

// const isDev = true;
const isDev = false;

const webpackConfig = {
    mode: isDev ? 'development' : 'production',
    output: {
        filename: 'script.js'
    },
    watch: false,
    devtool: isDev ? 'source-map' : 'none',
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            debug: isDev,
                            corejs: 3,
                            useBuiltIns: "usage"
                        }]
                    ]
                }
            }
        }]
    }
};

gulp.task("webserver", function () {
    return browserSync({
        /*proxy: "my.web.local",*/
        host: 'localhost',
        port: 3000,
        tunnel: false,
        server: path.build.html
    });
});

gulp.task("html:build", function () {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("images:build", function () {
    return gulp.src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("fonts:build", function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("js:build", function () {
    return gulp.src(path.src.js)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("style:build", function () {
    return gulp.src(path.src.css)
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("build", gulp.parallel(
    'html:build',
    'js:build',
    'style:build',
    'images:build',
    'fonts:build'
));

gulp.task("watch", function () {
    watch([path.watch.js], gulp.parallel('js:build'));
    watch([path.watch.html], gulp.parallel('html:build'));
    watch([path.watch.css], gulp.parallel('style:build'));
    watch([path.watch.images], gulp.parallel('images:build'));
});

gulp.task("clean", function (callback) {
    return rimraf(path.clean, callback);
});

var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: './src/js/lib/fav.png',
        dest: './src/images/icons',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
    return gulp.src(['./src/*.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('./src/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});

gulp.task('default', gulp.parallel('build', 'webserver', 'watch'));

gulp.task('prod', gulp.series('clean', gulp.parallel('build')));
