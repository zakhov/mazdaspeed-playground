var gulp = require('gulp')
var htmlreplace = require('gulp-html-replace')

gulp.task('buildIndex', function (done) {
    gulp.src('index.html')
        .pipe(
            htmlreplace({
                js: 'game.min.js',
            })
        )
        .pipe(gulp.dest('public/'))
    done()
})

gulp.task('copyAssets', function (done) {
    gulp.src('./media/**/*.{png,json,atlas,ogg,mp4,jpg,manifest}').pipe(gulp.dest('public/media'))

    done()
})
