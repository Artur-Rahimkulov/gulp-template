import gulp from 'gulp';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';

// Собирает все иконки из source/assets/svg (кроме брендов и логотипа)
// в один спрайт build/assets/svg/sprite.svg.
// Каждый файл becomes <symbol id="icon-<имя файла>">, подключается через <use>.
const sprite = () =>
  gulp
      .src([
        'source/assets/svg/**/*.svg',
        '!source/assets/svg/brands/**',
        '!source/assets/svg/logo.svg',
      ])
      .pipe(rename((file) => {
        file.basename = `icon-${file.basename}`;
        file.dirname = '.';
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/assets/svg'));

export default sprite;
