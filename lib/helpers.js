'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerBoundaries = containerBoundaries;
exports.between = between;
exports.either = either;
exports.getColorFromHex = getColorFromHex;
exports.getColorFromRGBA = getColorFromRGBA;
exports.getColorFromHSLA = getColorFromHSLA;
exports.isInt = isInt;

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function containerBoundaries(state, event, type) {
  var container = state[type + 'Container'];

  var containerWidth = container.width;
  var containerHeight = container.height;
  var containerLeft = container.left;
  var containerTop = container.top;

  var left = event.pageX - containerLeft;
  var top = event.pageY - containerTop;

  return {
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    top: top,
    left: left
  };
}

function between(min, max, value) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function either(values, currentValue) {
  return {
    set: function set(newValue) {
      if (!values.find(function (value) {
        return value === newValue;
      })) {
        throw new Error('newValue must be one of ' + values.join(', ') + ', got "' + newValue + '"');
      }

      return either(values, newValue);
    },

    is: function is(value) {
      return value === currentValue;
    },
    value: currentValue
  };
}

function getColorFromHex(hex) {
  var color = (0, _tinycolor2.default)(hex).toHsv();

  return color;
}

function getColorFromRGBA(state, channel, value) {
  var color = _tinycolor2.default.fromRatio(state.color).toRgb();
  color[channel] = value;

  return color;
}

function getColorFromHSLA(state, channel, value) {
  var color = _tinycolor2.default.fromRatio(state.color).toHsl();
  color[channel] = value;

  return color;
}

function isInt(n) {
  return n % 1 === 0;
}