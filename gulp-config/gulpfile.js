const gulp = require('gulp')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
//合并文件,自动写入html
const useref = require('gulp-useref')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const lazypipe = require('lazypipe')
const minimist = require('minimist')
const Path = require('path')

const argv = minimist(process.argv.slice(2))
const serverPath = argv.src || './src'

//压缩js插件
const uglify = require('gulp-uglify')
//压缩图片插件
const imagemin = require('gulp-imagemin')
//sprite插件
const spritesmith = require('gulp.spritesmith')

const base64 = require('gulp-base64')

const bs = require('browser-sync').create()
const del = require('del')

//编译css 
gulp.task('style', function () {
  return gulp.src(Path.join(serverPath,'postcss/**/*.css'))
    .pipe(postcss()) // 在.postcssrc.js 指定插件
    .pipe(gulp.dest(Path.join(serverPath,'css')))
    .pipe(bs.stream()) // 浏览器注入css 更新
})

gulp.task('sprite',function() {
  return gulp.src(Path.join(serverPath, 'images/sprite/**/*.png'))
    .pipe(spritesmith({
      imgName:'images/sprite.png',
      cssName:'css/sprite.css',
      padding:1,
    }))
    .pipe(gulp.dest(serverPath))
})

//dev
gulp.task('browserSync',['style'],function() {
  bs.init({
    server:serverPath
  })
})

gulp.task('watch',['browserSync'],function() {
  // 响应添加和删除文件
  gulp.watch('postcss/**/*.css',{cwd:serverPath},['style'])
  gulp.watch('*.html',{cwd:serverPath},bs.reload)
  gulp.watch('js/**/*.js',{cwd:serverPath},bs.reload)
})

gulp.task('default',['watch'])

//build

gulp.task('clean:dist',function() {
  return del(['dist'])
})

gulp.task('image',function() {
  return gulp.src(Path.join(serverPath, 'images/**/*.+(png|jpg|gif|svg)'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

const jsHandle = lazypipe().pipe(babel).pipe(uglify)

// 合并文件任务
// 在html 设置
// <!-- build:css css/combined.css -->
//  <link href="css/one.css" rel="stylesheet">
//  <link href="css/two.css" rel="stylesheet">
// <!-- endbuild -->

gulp.task('useref', ['clean:dist', 'style'], function () {
  return gulp.src(Path.join(serverPath, 'index.html'))
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
    .pipe(gulpif('*.css', base64({
      extensions: ['png'],
      maxImageSize: 20 * 1024,
      deleteAfterEncoding: false,
    })))
    .pipe(gulpif('*.js', jsHandle()))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build',['useref'])

