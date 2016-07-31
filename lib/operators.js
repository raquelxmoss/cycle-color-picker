'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sample = sample;

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sample(interval) {
  return function sampleOperator(stream) {
    var periodic$ = _xstream2.default.periodic(interval);

    return stream.map(function (event) {
      return periodic$.mapTo(event);
    }).flatten();
  };
}