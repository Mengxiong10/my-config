const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
//合并文件,自动写入html
const useref = require('gulp-useref')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
//压缩js插件
const uglify = require('gulp-uglify')
//压缩css插件
const cssnano = require('gulp-cssnano')
//压缩图片插件
const imagemin = require('gulp-imagemin')
//sprite插件
const spritesmith = require('gulp.spritesmith')

const lazypipe = require('lazypipe')
const bs = require('browser-sync').create()
const del = require('del')

//编译sass 
gulp.task('sass', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer()) // 在package.json 用 browserslist 字段去指定浏览器
    .pipe(gulp.dest('src/css'))
    .pipe(bs.stream()) // 浏览器注入css 更新
})

gulp.task('sprite',function() {
  return gulp.src('src/images/sprite/**/*.png')
    .pipe(spritesmith({
      imgName:'images/sprite.png',
      cssName:'scss/sprite.scss',
      padding:1,
    }))
    .pipe(gulp.dest('src'))
})

//dev
gulp.task('browserSync',['sass'],function() {
  bs.init({
    server:'./src'
  })
})

gulp.task('watch',['browserSync'],function() {
  // 响应添加和删除文件
  gulp.watch('scss/**/*.scss',{cwd:'./src'},['sass'])
  gulp.watch('./src/*.html',bs.reload)
  gulp.watch('./src/js/**/*.js',bs.reload)
})

gulp.task('default',['watch'])

//build

gulp.task('clean:dist',function() {
  del.sync('dist')
})

gulp.task('image',function() {
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

gulp.task('useref',['clean:dist','sass'],function() {
  return gulp.src('src/index.html')
    .pipe(useref({},lazypipe().pipe(sourcemaps.init,{loadMaps:true})))
    .pipe(gulpif('*.js',uglify()))
    .pipe(gulpif('*.css',cssnano()))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build',['useref'])

