'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ColorPicker;

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

var _droprepeats = require('xstream/extra/droprepeats');

var _droprepeats2 = _interopRequireDefault(_droprepeats);

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _helpers = require('./helpers');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Make sure bundle works
// - Publish to NPM

function ColorPicker(_ref) {
  var DOM = _ref.DOM;
  var Mouse = _ref.Mouse;
  var _ref$props$ = _ref.props$;
  var props$ = _ref$props$ === undefined ? _xstream2.default.empty() : _ref$props$;

  var initialState = {
    activeInput: (0, _helpers.either)(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: { width: 0, height: 0 },
    hueContainer: { width: 0 },
    alphaContainer: { width: 0 },

    color: { h: 0, s: 0, v: 1, a: 1 },
    colorInputFormat: (0, _helpers.either)(['hex', 'rgba', 'hsla'], 'hex')
  };

  var action$ = (0, _reducers2.default)({ DOM: DOM, Mouse: Mouse, props$: props$ });

  var state$ = action$.fold(function (state, action) {
    return action(state);
  }, initialState).compose((0, _droprepeats2.default)(function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  })) // TODO do this better
  .remember();

  var color$ = state$.map(function (state) {
    return _tinycolor2.default.fromRatio(state.color).toRgbString();
  });

  return {
    DOM: state$.map(_view2.default),
    color$: color$
  };
}