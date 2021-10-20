const gulp = require('gulp'); 
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');

const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");


gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	});
	gulp.watch("./build/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
	return gulp.src('./src/sass/**/*.+(scss|sass)')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass({outputStyle: 'compressed'}).on('error', sass.logError)) 
		.pipe(rename({suffix: '.min', prefix: ''}))
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./build/css/') )
		.pipe( browserSync.stream() )
});

gulp.task('html', function () {
    return gulp.src("./src/*.html")
        .pipe(gulp.dest("./build/"))
});

gulp.task('watch', function() {
	gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));

	gulp.watch(
		["./build/css/**/*.*"] 
	).on('all', browserSync.reload);
});


gulp.task('clean:build', function() {
	return del('./build')
});

gulp.task(
		'default', 
		gulp.series( 
			gulp.parallel('clean:build'),
			gulp.parallel('styles', 'html'), 
			gulp.parallel('server', 'watch'), 
			)
	);
