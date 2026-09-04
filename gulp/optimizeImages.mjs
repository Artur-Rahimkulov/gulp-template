import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

// Оптимизация исходных SVG (ручной таск).
// В общую сборку не включён, чтобы не переписывать исходники на каждый build.
const svgo = () =>
  gulp
      .src('source/img/**/*.svg')
      .pipe(
          imagemin([
            imagemin.svgo({
              plugins: [
                {removeViewBox: false},
                {removeRasterImages: true},
                {removeUselessStrokeAndFill: false}
              ],
            })
          ])
      )
      .pipe(gulp.dest('source/img'));

/*
  Optional tasks
  ---------------------------------

  createWebp — разово добавляет/обновляет .webp рядом с исходными растрами
  в source/assets/img/. В обычной сборке webp генерируются через webpImages.
*/
const createWebp = () =>
  gulp
      .src('source/assets/img/**/*.{png,jpg,jpeg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('source/assets/img'));

// Дожатие растровых картинок в build (ручной таск imagemin)
const optimizeImages = () =>
  gulp
      .src('build/assets/img/**/*.{png,jpg,jpeg}')
      .pipe(
          imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({quality: 75, progressive: true})
          ])
      )
      .pipe(gulp.dest('build/assets/img'));

// Генерация webp в build из исходных растров (основной таск сборки)
const webpImages = () =>
  gulp
      .src('source/assets/img/**/*.{png,jpg,jpeg}', { base: 'source' })
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('build'));

export {svgo, webpImages, createWebp, optimizeImages};
