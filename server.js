import budo from 'budo';
import babelify from 'babelify';
import sass from 'node-sass-middleware';
import path from 'path';

const middleware = sass({
  src: path.join(__dirname, 'src', 'styles'),
  dest: __dirname,
  debug: true,
  outputStyle: 'extended'
});

budo('./index.js', {
  serve: 'bundle.js',
  port: 8000,
  live: '*.{html, css}',
  stream: process.stdout,
  browserify: {
    transform: babelify
  },
  middleware: middleware
});

