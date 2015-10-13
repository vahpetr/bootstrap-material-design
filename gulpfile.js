var gulp = require('gulp');
var del = require('del');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var less = require('gulp-less');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
//TODO добавить https://github.com/OverZealous/lazypipe

process.env.NODE_ENV = "development";//production

var development = process.env.NODE_ENV === 'development';

var paths = {
    root: "./",
    components: "./bower_components/"
};

paths.src = paths.root + 'src/';
paths.temp = paths.root + 'temp/';
paths.dist = paths.root + 'dist/';

paths.styles = paths.src + 'styles/';
paths.scripts = paths.src + 'scripts/';

paths.js = paths.dist + "js/";
paths.css = paths.dist + "css/";
paths.fonts = paths.dist + "fonts/";

var config = {
    uglify: {
        min: {
            mangle: true,
            //compress: true,
            //sourceMap: true,
            //sourceMapIncludeSources: true,
            //sourceMapName: 'js/app.min.js.map',
            //mangle: {
            //    //toplevel: true,
            //    //screw_ie8: true

            //},
            compress: {
                //screw_ie8: true, // ?
                sequences: true, // join consecutive statemets with the “comma operator”
                properties: false, // optimize property access: a["foo"] → a.foo
                dead_code: true, // discard unreachable code
                drop_debugger: true, // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: true, // optimize if-s and conditional expressions
                comparisons: true, // optimize comparisons
                evaluate: true, // evaluate constant expressions
                booleans: true, // optimize boolean expressions
                loops: true, // optimize loops
                unused: true, // drop unused variables/functions
                hoist_funs: true, // hoist function declarations
                hoist_vars: true, // hoist variable declarations
                if_return: true, // optimize if-s followed by return/continue
                join_vars: true, // join var declarations
                cascade: true, // try to cascade `right` into `left` in sequences
                side_effects: true, // drop side-effect-free statements
                warnings: false, // warn about potentially dangerous optimizations/code
                //negate_iife: true,
                drop_console: true,
                //droop func
                pure_funcs: [
                    'log'
                ],
                // global definitions
                global_defs: {
                    DEBUG: false
                }
            },
            output: true
            //    {
            //    indent_start: 0, // start indentation on every line (only when `beautify`)
            //    indent_level: 4, // indentation level (only when `beautify`)
            //    quote_keys: false, // quote all keys in object literals?
            //    space_colon: true, // add a space after colon signs?

            //    inline_script: false, // escape "</script"?
            //    width: 80, // informative maximum line width (for beautified output)
            //    max_line_len: 32000, // maximum line length (for non-beautified output)
            //    beautify: false, // beautify output?
            //    source_map: 's.map', // output a source map
            //    bracketize: false, // use brackets every time?
            //    comments: false, // output comments?
            //    semicolons: true, // use semicolons to separate statements? (otherwise, newlines)
            //    ascii_only: true // output ASCII-safe? (encodes Unicode characters as ASCII)
            //}//,
            //sourceMapIncludeSources: true,
            //outSourceMap: true,
            //sourceRoot: ''
        },
        develop: {
            mangle: false,
            compress: {
                //screw_ie8: true, // ?
                sequences: false, // join consecutive statemets with the “comma operator”
                properties: false, // optimize property access: a["foo"] → a.foo
                dead_code: true, // discard unreachable code
                drop_debugger: true, // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: false, // optimize if-s and conditional expressions
                comparisons: false, // optimize comparisons
                evaluate: false, // evaluate constant expressions
                booleans: false, // optimize boolean expressions
                loops: false, // optimize loops
                unused: true, // drop unused variables/functions
                hoist_funs: false, // hoist function declarations
                hoist_vars: false, // hoist variable declarations
                if_return: false, // optimize if-s followed by return/continue
                join_vars: false, // join var declarations
                cascade: false, // try to cascade `right` into `left` in sequences
                side_effects: false, // drop side-effect-free statements
                warnings: false, // warn about potentially dangerous optimizations/code
                //negate_iife: true,
                drop_console: true,
                //droop func
                // pure_funcs: [
                // 'console.log'
                // ],
                // global definitions
                global_defs: {
                    DEBUG: false
                }
            },
            output: {
                beautify: true
            }
        }
    }
};

gulp.task("clean", function () {
    return del.sync([paths.temp, paths.js, paths.css, paths.fonts]);
});

//===

gulp.task('fonts:font-awesome:copy', function () {
    return gulp.src(paths.components + 'font-awesome-less/fonts/**/*')
        .pipe(gulp.dest(paths.dist + 'fonts'));
});
// gulp.task('fonts:bootstrap:copy', function () {
//     return gulp.src(paths.components + 'bootstrap/fonts/**/*')
//         .pipe(gulp.dest(paths.app + 'fonts'));
// });
gulp.task('fonts:copy', [
    // 'fonts:bootstrap:copy',
    'fonts:font-awesome:copy'
]);

//===

gulp.task('css:bootstrap:copy', function () {
    return gulp.src(paths.components + 'bootstrap/less/**/*')
        .pipe(gulp.dest(paths.temp + 'bootstrap/less'));
});
gulp.task('css:bootstrap:prepare', ['css:bootstrap:copy'], function () {
    return gulp.src(paths.styles + 'bootstrap/less/**/*')
        .pipe(gulp.dest(paths.temp + 'bootstrap/less'));
});
gulp.task('css:bootstrap:compile', ['css:bootstrap:prepare'], function () {
    return gulp.src(paths.temp + 'bootstrap/less/styles.less')
        .pipe(gulpif(!development, sourcemaps.init()))
        .pipe(less())
        .pipe(gulpif(!development, minifyCss({compatibility: 'ie7'})))
        .pipe(rename("bootstrap.css"))
        .pipe(gulpif(!development, sourcemaps.write('./')))
        .pipe(gulp.dest(paths.css));
});

// gulp.task('css:font-awesome:copy', function () {
//     return gulp.src(paths.components + 'font-awesome-less/less/**/*')
//         .pipe(gulp.dest(paths.temp + 'font-awesome-less/less'));
// });
// gulp.task('css:font-awesome:prepare', ['css:font-awesome:copy'], function () {
//     return gulp.src(paths.styles + 'font-awesome-less/less/**/*')
//         .pipe(gulp.dest(paths.temp + 'font-awesome-less/less'));
// });
// gulp.task('css:font-awesome:compile', ['css:font-awesome:prepare'], function () {
//     return gulp.src(paths.temp + 'font-awesome-less/less/styles.less')
//         .pipe(gulpif(!development, sourcemaps.init()))
//         .pipe(less())
//         .pipe(rename("font-awesome.css"))
//         .pipe(gulpif(!development, sourcemaps.write('./')))
//         .pipe(gulp.dest(paths.css));
// });

gulp.task('css:compile', [
    'css:bootstrap:compile'//,
   // 'css:font-awesome:compile'
]);

//===

gulp.task('js:bootstrap:copy', function () {
    return gulp.src(paths.components + 'bootstrap/js/**/*')
        .pipe(gulp.dest(paths.temp + 'bootstrap/js'));
});
gulp.task('js:bootstrap:prepare', ['js:bootstrap:copy'], function () {
    return gulp.src(paths.styles + 'bootstrap/js/**/*')
        .pipe(gulp.dest(paths.temp + 'bootstrap/js'));
});
gulp.task('js:bootstrap:compile', ['js:bootstrap:prepare'], function () {
    return gulp.src([
        //TODO переписать
        paths.temp + 'bootstrap/js/tooltip.js',
        paths.temp + 'bootstrap/js/affix.js',
        paths.temp + 'bootstrap/js/alert.js',
        paths.temp + 'bootstrap/js/button.js',
        paths.temp + 'bootstrap/js/carousel.js',
        paths.temp + 'bootstrap/js/collapse.js',
        paths.temp + 'bootstrap/js/dropdown.js',
        paths.temp + 'bootstrap/js/modal.js',
        paths.temp + 'bootstrap/js/popover.js',
        paths.temp + 'bootstrap/js/scrollspy.js',
        paths.temp + 'bootstrap/js/tab.js',
        paths.temp + 'bootstrap/js/translation.js'
    ])
        .pipe(gulpif(!development, sourcemaps.init()))
        .pipe(concat('bootstrap.js'))
        .pipe(uglify(development ? config.uglify.develop : config.uglify.min))
        .pipe(gulpif(!development, sourcemaps.write('./')))
        .pipe(gulp.dest(paths.js));
});

gulp.task('js:compile', [
    'js:bootstrap:compile'
]);

gulp.task('connect', function () {
    connect.server({
        root: [paths.dist],
        port: 8000,
        livereload: true
    });
});

var html = [
    paths.dist + '*.html'
];
gulp.task('html', function () {
    return gulp.src(html).pipe(connect.reload());
});
var css = [
    paths.styles + '**/*.scss',
    paths.styles + '**/*.less'
];
gulp.task('css', ['css:compile'], function () {
    return gulp.src(css).pipe(connect.reload());
});
var js = [
    paths.temp + 'bootstrap/js/*.js'
];
gulp.task('js', ['js:compile'], function () {
    return gulp.src(js).pipe(connect.reload());
});
gulp.task('watch', function () {
    gulp.watch(html, ['html']);
    gulp.watch(css, ['css']);
   // gulp.watch(js, ['js']);
});

gulp.task('build', [
    'css:compile'//,
    //'js:compile'//,
    //'fonts:copy'
]);

gulp.task('develop', [
    'build',
    'connect',
    'watch'
]);

gulp.task('default', ['clean', 'develop']);