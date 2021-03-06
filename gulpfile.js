'use strict';

let fs = require("fs"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    orderValues = require("postcss-ordered-values"),
    connect = require("gulp-connect"),
    sourcemap = require("gulp-sourcemaps"),
    imagemin= require("gulp-imagemin"),
    sync = require("gulp-directory-sync"),
    cleancss = require("gulp-clean-css"),
    mqpacker = require("css-mqpacker"),
    merge = require("postcss-merge-rules"),
    cssnext = require("postcss-cssnext"),
    ssync = require("gulp-scp"),
    babel  = require('gulp-babel'),
    placehold = require("postcss-placehold"),
    browserSync = require('browser-sync').create(),
    borwsersync_reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    pump = require('pump');
    // clip_path = require("postcss-clip-path-polyfill");


//let prefixer = autoprefixer({browsers: "last 5 versions" , grid:true }); //clip_path()

let plugins = [cssnext({ features:{ customProperties:{ preserve:true }, grid:true   } , browsers: ['last 5 version']  }),orderValues(),mqpacker(),merge()];


gulp.task('connect',() => {


  connect.server({

    host:'localhost',
    port:4000,
    livereload:true,
    root:"src/"

  });


});

gulp.task('sass',() => {

  return gulp.src("src/sass/**/*.scss")
               .pipe(sourcemap.init())
               .pipe(sass({}).on('error',sass.logError)) //sourceMaps: true
               .pipe(postcss(plugins,{}))
               .pipe(sourcemap.write('.'))
               .pipe(gulp.dest("src/css/"));
});

gulp.task('reload',() => {

  return gulp.src("*")
              .pipe(connect.reload());
});

gulp.task('production',() => {




  let files_sync   =  gulp.src("")
                          .pipe(sync('src/','dist/',{ printSummary:true , ignore:["sass","dev"] }))
                          .on('error',() => {
                                console.log("Something went wrong with files sync!");
                          });

  let cssminify    = gulp.src('dist/css/*.css')
                          .pipe(cleancss())
                          .pipe(gulp.dest("dist/css/"));


        return [files_sync,cssminify];

});


gulp.task('image-minify',() => {

  return imagesminify =  gulp.src("src/images/*")
                          .pipe(imagemin({ progressive: true, optimizationLevel:5, removeViewBox: true }))
                          .pipe(gulp.dest("dist/images/"));
});


gulp.task('browser-sync', function() {
  browserSync.init({
      server: {

          host:'192.168.0.105',
          baseDir: "src/",
          injectChanges:true


      },
      port:4000,
      browser:['chrome']
  });
});

gulp.task('borwsersync_reload',()=> {

  borwsersync_reload();

});

gulp.task('transpile-js',function(){

  return gulp.src('src/js/script.js')
             .pipe(sourcemap.init())
             .pipe(babel({
               presets: ["env","es2015"]
             }))
             .pipe(sourcemap.write('.'))
             .pipe(gulp.dest('src/js/transpiled'));

});

gulp.task('watch',() => {

    console.log("waiting for changes");
    gulp.watch('src/sass/**/*.scss',['sass']);
    gulp.watch('src/css/*.css',['reload','borwsersync_reload']); //'reload'
    gulp.watch('src/**/*.html',['reload','borwsersync_reload']); //'reload'
    gulp.watch('src/js/**/*.js',['transpile-js','reload','borwsersync_reload']); //'reload'

});

gulp.task('default',['connect','watch']); //'connect'
