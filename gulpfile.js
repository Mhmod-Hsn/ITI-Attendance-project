const gulp        = require('gulp');
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
  await includeHTML();
  await copyAssets();
  await compileSass();
  await js();
  await images();

  reload();
}

exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.scripts.dest
    }
  });

    // Build and reload at the first time
  buildAndReload();
  // Watch task
  watch([
    "*.html",
    "'./sass/**/*.scss'",
    "./js/*.js",
    "./images/**/*.{gif,jpg,png,svg}",
    "./assets/**/*"
  ], series(buildAndReload));

  // // Watch html task
  // watch('./*.html',  includeHTML);

  // // Watch Sass task
  // watch('./sass/**/*.scss',  series(compileSass));

  // // Watch js task
  // watch("./js/*.js", js);
    
  // // Watch images task
  // watch("./images/**/*.{gif,jpg,png,svg}", images);
    
};


async function includeHTML(){
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
async function compileSass() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
}
async function js() {
  gulp.src("./js/*.js")
    .pipe(concat("script.js"))
    .pipe(gulp.dest("./build/assets/js"));
}
async function images() {
  gulp.src(['./images/**/*.{gif,jpg,png,svg}'])
      .pipe(gulp.dest('./build/assets/images'));
}
