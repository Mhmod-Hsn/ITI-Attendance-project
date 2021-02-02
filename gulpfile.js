const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const concat = require("gulp-concat");


const paths = {
  scripts: {
    src: './',
    dest: './build/'
  }
};

// Reload Server
async function reload() {
  server.reload();
}

// Copy assets after build
async function copyAssets() {
  gulp.src(['assets/**/*'])
    .pipe(gulp.dest(paths.scripts.dest));
}

// Build files html and reload server
async function buildAndReload() {
   includeHTML();
   copyAssets();
   compileSass();
   js();
   images();

  reload();
}

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    port: 8080,
    ui: {
      port: 8081 //Or whatever port you want for browsersync ui
    },
    server: {
      baseDir: paths.scripts.dest
    }
  });

  // Build and reload at the first time
  buildAndReload();
  // Watch task
  watch([
    "*.html",
    "'./css/**/*.scss'",
    "./js/*.js",
    "./images/**/*.{gif,jpg,png,svg}",
    "./assets/**/*"
  ], series(buildAndReload));
};


 function includeHTML(){
  return gulp.src([
    '*.html',
    '!header.html', // ignore
    '!footer.html' // ignore
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Sass compiler
 function compileSass() {
  gulp.src('./css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
}
 function js() {
  gulp.src("./js/*.js")
    .pipe(gulp.dest("./build/assets/js"));
}
 function images() {
  gulp.src(['./images/**/*.{gif,jpg,png,svg}'])
      .pipe(gulp.dest('./build/assets/images'));
}
