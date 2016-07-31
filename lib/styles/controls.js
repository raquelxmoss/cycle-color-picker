'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controls = undefined;

var _alpha = require('./alpha');

var _hue = require('./hue');

var controls = exports.controls = {
  'display': 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'padding': '10px 15px',
  'height': '40px',
  '.swatch': {
    '.swatch-color': {
      'width': '20px',
      'height': '20px',
      'border-radius': '50%'
    },
    '.swatch-underlay': {
      'border-radius': '50%',
      'background': 'linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), rgb(255, 255, 255)',
      'background-position': '0 0, 5px 5px',
      '-webkit-background-origin': 'padding-box',
      'background-origin': 'padding-box',
      '-webkit-background-clip': 'border-box',
      'background-clip': 'border-box',
      '-webkit-background-size': '10px 10px',
      'background-size': '10px 10px'
    }
  },
  '.sliders': {
    'display': 'flex',
    'flex-direction': 'column',
    'justify-content': 'space-around',
    'margin-left': '10px',
    'width': '100%',
    'height': '100%'
  },
  '.hue-container': _hue.hue,
  '.alpha-container': _alpha.alpha
};