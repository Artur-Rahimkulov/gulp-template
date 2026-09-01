import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import htmlbeautify from 'gulp-html-beautify';
import dom from 'gulp-dom';

const compileHtml = () => {
  return gulp.src(['source/html/*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@root',
        context: { // глобальные переменные для include
          test: 'text',
        },
      }))
      .pipe(htmlbeautify({
        'indent_size': 2,
        'preserve_newlines': true,
        'max_preserve_newlines': 0,
        'wrap_attributes': 'auto',
      }))
      .pipe(dom(function(){
        const scripts = this.querySelectorAll('[data-gulp-script]');
        if (scripts[0]) {
          scripts.forEach(script => {
            script.src = `${script.src}?${Date.now()}`
          });
        }
        const styles = this.querySelectorAll('link[rel="stylesheet"]')
        if (styles[0]) {
          styles.forEach(style => {
            style.href = `${style.href}?${Date.now()}`
          });
        }
      }))
      .pipe(gulp.dest('build'));
};

export default compileHtml;
