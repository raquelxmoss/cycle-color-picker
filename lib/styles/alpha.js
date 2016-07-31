'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var alpha = exports.alpha = {
  'height': '10px',
  'width': '100%',
  'cursor': 'pointer',
  'border-radius': '2px',
  'position': 'relative',
  '.gradient-overlay': {
    'width': '100%',
    'height': '100%',
    'position': 'absolute',
    'border-radius': '2px'
  },
  '.checkerboard': {
    'position': 'absolute',
    '-webkit-box-sizing': 'content-box',
    '-moz-box-sizing': 'content-box',
    'box-sizing': 'content-box',
    'width': '100%',
    'height': '10px',
    'border-radius': '2px',
    'background': 'linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), rgb(255, 255, 255)',
    'background-position': '0 0, 5px 5px',
    '-webkit-background-origin': 'padding-box',
    'background-origin': 'padding-box',
    '-webkit-background-clip': 'border-box',
    'background-clip': 'border-box',
    '-webkit-background-size': '10px 10px',
    'background-size': '10px 10px'
  },
  '.alpha-indicator': {
    'position': 'absolute',
    'width': '10px',
    'height': '10px',
    'background': 'white',
    'border-radius': '50%',
    'box-shadow': 'rgba(0, 0, 0, 0.368627) 0px 1px 4px 0px',
    'transform': 'translateX(-5px)'
  }
};