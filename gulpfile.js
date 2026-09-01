import gulp from 'gulp';
import browserSync from 'browser-sync';
import del from 'del';
import styles from './gulp/compileStyles.mjs';
import { copy, copyImages, copySvg } from './gulp/copyAssets.mjs';
import js from './gulp/compileScripts.mjs';
import { svgo, webpImages, createWebp, optimizeImages } from './gulp/optimizeImages.mjs';
import html from './gulp/compileHtml.mjs';

const server = browserSync.create();
const streamStyles = () => styles().pipe(server.stream());
const clean = () => del('build');
const refresh = (done) => {
  server.reload();
  done();
};


const syncServer = () => {
  server.init({
    server: 'build/',
    index: 'index.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/html/**/*.html', gulp.series(html, refresh));
  gulp.watch('source/sass/**/*.{scss,sass}', streamStyles);
  gulp.watch('source/js/**/*.{js,json}', gulp.series(js, refresh));
  gulp.watch('source/data/**/*.{js,json}', gulp.series(copy, refresh));
  gulp.watch('source/assets/**/*.*', gulp.series(copy, refresh));
  gulp.watch('source/assets/svg/**/*.svg', gulp.series(copySvg, html, refresh));
  gulp.watch('source/assets/img/**/*.{png,jpg,jpeg,webp}', gulp.series(copyImages, webpImages, html, refresh));

  gulp.watch('source/fonts/**', gulp.series(copy, refresh));
  gulp.watch('source/favicon/**', gulp.series(copy, refresh));
  gulp.watch('source/downloads/**', gulp.series(copy, refresh));
  gulp.watch('source/*.php', gulp.series(copy, refresh));
};


const build = gulp.series(clean, svgo, copy, styles, js, html, webpImages);
const start = gulp.series(build, syncServer);

export { optimizeImages as imagemin, createWebp as webp, build, start };
