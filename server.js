import budo from 'budo';
import babelify from 'babelify';
import sass from 'node-sass-middleware';
import path from 'path';

const middleware = sass({
  src: __dirname,
  dest: __dirname,
  debug: true,
  outputStyle: 'compressed'
});

var app = budo('./index.js', {
  serve: 'bundle.js',
  port: 8000,
  stream: process.stdout,
  browserify: {
    transform: babelify
  },
  middleware: middleware
})
.live()
.watch(['*.{html, scss}'])
.on('watch', function (type, file) {
  app.reload('styles.css');
})
.on('pending', () => app.reload());
