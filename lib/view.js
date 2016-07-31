'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = view;

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _stylin = require('stylin');

var _stylin2 = _interopRequireDefault(_stylin);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dom = require('@cycle/dom');

var _helpers = require('./helpers');

var _colorPicker = require('./styles/color-picker');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorInputViews = {
  hex: function hex(color) {
    return renderHexInputElement(color.toHexString());
  },
  rgba: function rgba(color) {
    return renderColorInputElement(color.toRgb());
  },
  hsla: function hsla(color) {
    return renderColorInputElement(color.toHsl());
  }
};

function makeInputElement(inputType, color, channel) {
  var value = (0, _helpers.isInt)(color[channel]) ? color[channel] : color[channel].toFixed(2);

  return (0, _dom.input)('.' + inputType + '-input .color-input', {
    props: {
      value: value,
      'data-channel': channel
    }
  });
}

function renderColorInputElement(color) {
  var inputType = Object.keys(color).join('');

  return (0, _dom.div)('.color-input-container', _lodash2.default.map(color, function (value, channel) {
    return (0, _dom.div)('.channel-container', [makeInputElement(inputType, color, channel), (0, _dom.span)(channel)]);
  }));
}

function renderHexInputElement(color) {
  return (0, _dom.input)('.hex-input', { props: { type: 'text', value: color } });
}

function renderColorInputs(state) {
  var format = state.colorInputFormat.value;
  var color = _tinycolor2.default.fromRatio(state.color);

  return (0, _dom.div)('.color-display', [colorInputViews[format](color)]);
}

function renderInputSwitcher(state) {
  return (0, _dom.div)('.input-switcher', [(0, _dom.p)('.switcher .up'), (0, _dom.p)('.switcher .down')]);
}

function renderSaturationInput(state) {
  var saturationBackground = 'hsl(' + state.color.h * 360 + ', 100%, 50%)';
  var saturationIndicatorColor = state.color.v < 0.5 ? '#fff' : '#000';

  var saturationIndicatorStyle = {
    left: state.saturationContainer.width * state.color.s + 'px',
    top: state.saturationContainer.height * (1 - state.color.v) + 'px',
    'border-color': '' + saturationIndicatorColor
  };

  return (0, _dom.div)('.saturation', [(0, _dom.div)('.white-overlay'), (0, _dom.div)('.saturation-color', { style: { background: saturationBackground } }), (0, _dom.div)('.grey-overlay'), (0, _dom.div)('.saturation-indicator', { style: saturationIndicatorStyle })]);
}

function renderHueInput(state) {
  var hueIndicatorStyle = {
    left: state.hueContainer.width * state.color.h + 'px'
  };

  return (0, _dom.div)('.hue-container', [(0, _dom.div)('.hue', [(0, _dom.div)('.hue-indicator', { style: hueIndicatorStyle })])]);
}

function renderAlphaInput(state) {
  var alphaIndicatorStyle = {
    left: state.alphaContainer.width * state.color.a + 'px'
  };

  var color = _tinycolor2.default.fromRatio(state.color);

  var gradientStart = color.clone().setAlpha(0);
  var gradientStyle = { background: 'linear-gradient(to right, ' + (0, _tinycolor2.default)(gradientStart).toRgbString() + '  0%, ' + color.toHexString() + ' 100%)' };

  return (0, _dom.div)('.alpha-container', [(0, _dom.div)('.alpha', [(0, _dom.div)('.checkerboard'), (0, _dom.div)('.gradient-overlay', { style: gradientStyle }), (0, _dom.div)('.alpha-indicator', { style: alphaIndicatorStyle })])]);
}

function renderSwatch(state) {
  var color = _tinycolor2.default.fromRatio(state.color);

  var swatchBackground = color.clone().setAlpha(state.color.a);
  var swatchStyle = { 'background-color': (0, _tinycolor2.default)(swatchBackground).toRgbString() };

  return (0, _dom.div)('.swatch', [(0, _dom.div)('.swatch-underlay', [(0, _dom.div)('.swatch-color', { style: swatchStyle })])]);
}

function view(state) {
  return (0, _dom.div)('.color-picker ' + _stylin2.default.unimportant(_colorPicker.styles), [renderSaturationInput(state), (0, _dom.div)('.controls-container', [renderSwatch(state), (0, _dom.div)('.sliders', [renderHueInput(state), renderAlphaInput(state)])]), (0, _dom.div)('.inputs-container', [renderColorInputs(state), renderInputSwitcher(state)])]);
}