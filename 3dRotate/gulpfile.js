// 引入 gulp及组件
var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    domSrc=require('gulp-dom-src'),            //替换html中引用路径
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');   //livereload


// 图片处理
gulp.task('images', function(){
    // var imgSrc = 'images/**/*',
      var  imgDst = 'dist/images';
 domSrc({file:'html/diy.html',selector:'images',attribute:'src'})
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})

// js处理
gulp.task('js', function () {
    var jsSrc = 'js/*.js',
        jsDst ='dist/js';

    gulp.src(jsSrc)
        // .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});

gulp.task('css',function() {
    var cssSrc='css/*.css';
        cssDst='dist/css';
    gulp.src(cssSrc)
        .pipe(minifycss())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(cssDst));
})
// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['dist/css', 'dist/js', 'dist/images'], {read: false})
        .pipe(clean());
});


// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', function(){
    gulp.start('css','css','images','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('watch',function(){

    server.listen(port, function(err){
        if (err) {
            return console.log(err);
        }

        // 监听html
        gulp.watch('html/*.html', function(event){
            gulp.run('html');
        })

        // 监听css
        gulp.watch('scss/*.scss', function(){
            gulp.run('css');
        });

        // 监听images
        gulp.watch('images/**/*', function(){
            gulp.run('images');
        });

        // 监听js
        gulp.watch('js/*.js', function(){
            gulp.run('js');
        });

    });
});