'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = undefined;

var _saturation = require('./saturation');

var _controls = require('./controls');

var _inputs = require('./inputs');

var styles = exports.styles = {
  'width': '255px',
  'height': '250px',
  'background': '#EEE',
  'border-radius': '2px',
  'box-shadow': 'rgba(0, 0, 0, 0.298039) 0px 0px 2px, rgba(0, 0, 0, 0.298039) 0px 4px 8px',
  'font-family': 'Helvetica, sans-serif',
  '.inputs-container': _inputs.inputs,
  '.controls-container': _controls.controls,
  '.saturation': _saturation.saturation
};