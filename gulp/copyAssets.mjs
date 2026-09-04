import gulp from 'gulp';

const copySvg = () =>
  gulp.src('source/assets/img/**/*.svg', { base: 'source' })
    .pipe(gulp.dest('build'));

// Растровые картинки в build не копируются — вместо них генерируются webp
// (см. webpImages). Копируем только уже готовые webp, если такие есть в исходниках.
const copyImages = () =>
  gulp.src('source/assets/img/**/*.webp', { base: 'source', allowEmpty: true })
    .pipe(gulp.dest('build'));

const copy = () =>
  gulp.src([
    'source/**.html',
    'source/fonts/**',
    'source/assets/**/*',
    '!source/assets/img/**/*.{png,jpg,jpeg}',
    'source/favicon/**'
  ], {
    base: 'source',
  })
    .pipe(gulp.dest('build'));

export { copy, copyImages, copySvg };
