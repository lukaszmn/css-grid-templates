const { src, dest } = require('gulp');

exports.default = function() {
  return src('src/*')
    .pipe(dest('dest/'));
}
