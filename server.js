import budo from 'budo';
import babelify from 'babelify';

budo('./index.js', {
  serve: 'bundle.js',
  port: 8000,
  live: '*.{html, css}',
  stream: process.stdout,
  browserify: {
    transform: babelify
  }
});

