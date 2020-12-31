var gulp = require('gulp')
var htmlreplace = require('gulp-html-replace')

gulp.task('buildIndex', function (done) {
    gulp.src('game/index.html')
        .pipe(
            htmlreplace({
                js: 'game.min.js',
            })
        )
        .pipe(gulp.dest('public/'))
    done()
})

gulp.task('copyAssets', function (done) {
    gulp.src('game/media/**/*.{png,json,atlas,ogg,mp4,jpg,manifest}').pipe(gulp.dest('public/media'))
    done()
})

gulp.task('initFavicons', function (done) {
    gulp.src('scripts/favicons/*.{png,manifest}').pipe(gulp.dest('game/media/favicons'))
    done()
})
