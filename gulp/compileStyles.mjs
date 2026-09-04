import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';
import csso from 'gulp-csso';
import gcmq from 'gulp-group-css-media-queries';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);

// px → rem на этапе сборки: в исходниках пишем привычные px из макета,
// в CSS уходит rem (кроме бордеров и значений < 2px).
const pxToRem = pxtorem({
  rootValue: 16,
  propList: ['*'],
  minPixelValue: 2,
  mediaQuery: false,
});

const compileStyles = () =>
  gulp.src('source/sass/style.scss', {sourcemaps: true})
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([pxToRem]))
      // .pipe(postcss([autoprefixer({
      //   grid: true,
      // })]))
      .pipe(gcmq()) // выключите, если в проект импортятся шрифты через ссылку на внешний источник
      .pipe(gulp.dest('build/css'))
      .pipe(csso())
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest('build/css', {sourcemaps: '.'}));

export default compileStyles;
