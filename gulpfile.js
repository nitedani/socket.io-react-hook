"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

// Enable ES6
//require("harmonize")(["harmony", "harmony-proxies", "harmony_proxies"]);

var gulp = require("gulp"),
  tsc = require("gulp-typescript"),
  runSequence = require("run-sequence"),
  del = require("del");
//******************************************************************************
//* CLEAN
//******************************************************************************
gulp.task("clean", function () {
  return del(["src/**/*.js", "src/*.js", "lib", "es", "amd"]);
});

//******************************************************************************
//* BUILD
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json", {
  module: "commonjs",
  typescript: require("typescript"),
});

gulp.task("build-lib", function () {
  return gulp
    .src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(tsLibProject())
    .on("error", function (err) {
      process.exit(1);
    })
    .js.pipe(gulp.dest("lib/"));
});

var tsAmdProject = tsc.createProject("tsconfig.json", {
  module: "amd",
  typescript: require("typescript"),
});

gulp.task("build-amd", function () {
  return gulp
    .src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(tsAmdProject())
    .on("error", function (err) {
      process.exit(1);
    })
    .js.pipe(gulp.dest("amd/"));
});

var tsEsProject = tsc.createProject("tsconfig.json", {
  module: "es2015",
  typescript: require("typescript"),
});

gulp.task("build-es", function () {
  return gulp
    .src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(tsEsProject())
    .on("error", function (err) {
      process.exit(1);
    })
    .js.pipe(gulp.dest("es/"));
});

var tsDtsProject = tsc.createProject("tsconfig.json", {
  declaration: true,
  noResolve: false,
  typescript: require("typescript"),
});

gulp.task("build-dts", function () {
  return gulp
    .src(["src/**/*.ts", "src/**/*.tsx"])
    .pipe(tsDtsProject())
    .on("error", function (err) {
      process.exit(1);
    })
    .dts.pipe(gulp.dest("dts"));
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("build", function (cb) {
  runSequence(["build-es", "build-lib", "build-amd", "build-dts"]);
});

gulp.task("default", function (cb) {
  runSequence("clean", "build", cb);
});
