'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = makeReducer$;

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

var _debounce = require('xstream/extra/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _delay = require('xstream/extra/delay');

var _delay2 = _interopRequireDefault(_delay);

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _operators = require('./operators');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var update = {
  alpha: function alpha(event) {
    return updateChannel(event, 'alpha', function (x) {
      return { a: x };
    });
  },
  hue: function hue(event) {
    return updateChannel(event, 'hue', function (x) {
      return { h: x };
    });
  },
  saturation: function saturation(event) {
    return updateChannel(event, 'saturation', function (x, y) {
      return { s: x, v: 1 - y };
    });
  }
};

var updateColorFromInput = {
  hex: function hex(state, channel, value) {
    return (0, _helpers.getColorFromHex)(value);
  },
  rgba: function rgba(state, channel, value) {
    return (0, _helpers.getColorFromRGBA)(state, channel, value);
  },
  hsla: function hsla(state, channel, value) {
    return (0, _helpers.getColorFromHSLA)(state, channel, value);
  }
};

function updateChannel(event, type, updateFunction) {
  return function _updateChannel(state) {
    if (!state.activeInput.is(type)) {
      return state;
    }

    var _containerBoundaries = (0, _helpers.containerBoundaries)(state, event, type);

    var containerWidth = _containerBoundaries.containerWidth;
    var containerHeight = _containerBoundaries.containerHeight;
    var top = _containerBoundaries.top;
    var left = _containerBoundaries.left;


    var xRatio = (0, _helpers.between)(0, containerWidth, left) / containerWidth;
    var yRatio = (0, _helpers.between)(0, containerHeight, top) / containerHeight;

    return _extends({}, state, {

      color: _extends({}, state.color, updateFunction(xRatio, yRatio))
    });
  };
}

function colorInputShouldChange(state, input) {
  return input === 'alpha' && state.colorInputFormat.value === 'hex';
}

function setActiveInputs(name) {
  return function _setActiveInputs(state) {
    var colorInputFormat = colorInputShouldChange(state, name) ? 'rgba' : state.colorInputFormat.value;

    return Object.assign({}, state, {
      activeInput: state.activeInput.set(name),
      colorInputFormat: state.colorInputFormat.set(colorInputFormat)
    });
  };
}

function makeInputElementReducer$(name, DOM) {
  var container = DOM.select('.' + name);

  var click$ = container.events('click');

  var mouseDown$ = container.events('mousedown');

  var activeInput$ = _xstream2.default.merge(mouseDown$, click$).map(function (_) {
    return setActiveInputs(name);
  });

  var deactivateInput$ = click$.compose((0, _delay2.default)(200)).map(function (ev) {
    return function (state) {
      return Object.assign({}, state, { activeInput: state.activeInput.set('none') });
    };
  });

  var mouseMove$ = container.events('mousemove');

  var update$ = _xstream2.default.merge(mouseMove$, click$).map(function (ev) {
    return update[name](ev);
  });

  var container$ = container.elements().drop(1).map(function (el) {
    return el[0].getBoundingClientRect();
  }).map(function (value) {
    return function (state) {
      return _extends({}, state, _defineProperty({}, name + 'Container', value));
    };
  }).compose((0, _operators.sample)(100));

  return _xstream2.default.merge(activeInput$, deactivateInput$, update$, container$);
}

function makeTextInputElementReducer$(name, DOM) {
  return DOM.select('.' + name + '-input').events('input').compose((0, _debounce2.default)(300)).map(function (ev) {
    return { value: ev.target.value, channel: ev.target.getAttribute('data-channel') };
  }).map(function (_ref) {
    var channel = _ref.channel;
    var value = _ref.value;
    return setStateFromInput({ channel: channel, value: value });
  });
}

function setStateFromProps(props) {
  return function _setStateFromProps(state) {
    if ('color' in props) {
      props.color = (0, _tinycolor2.default)(props.color).toHsv();
      props.color.h /= 360;
    }

    return _extends({}, state, props);
  };
}

function setStateFromInput(_ref2) {
  var channel = _ref2.channel;
  var value = _ref2.value;

  return function _setStateFromInput(state) {
    var newColor = updateColorFromInput[state.colorInputFormat.value](state, channel, value);
    var colorAsHex = (0, _tinycolor2.default)(newColor).toHexString();

    if ((0, _tinycolor2.default)(colorAsHex).isValid()) {
      var color = (0, _tinycolor2.default)(newColor).toHsv();
      color.h /= 360;

      return _extends({}, state, {

        color: color
      });
    }

    return state;
  };
}

function changeColorInputFormat() {
  return function _changeColorInputFormat(state) {
    var inputFormats = ['rgba', 'hex', 'hsla'];
    var currentInput = inputFormats.indexOf(state.colorInputFormat.value);
    var newInput = ((currentInput + 1) % inputFormats.length + inputFormats.length) % inputFormats.length;

    var newFormat = inputFormats[newInput];

    return Object.assign({}, state, { colorInputFormat: state.colorInputFormat.set(newFormat) });
  };
}

function makeReducer$(_ref3) {
  var DOM = _ref3.DOM;
  var Mouse = _ref3.Mouse;
  var props$ = _ref3.props$;

  var mouseUp$ = Mouse.up().map(function (ev) {
    return function (state) {
      return _extends({}, state, { activeInput: state.activeInput.set('none') });
    };
  });

  var setStateFromHexInput$ = DOM.select('.hex-input').events('input').compose((0, _debounce2.default)(300)).filter(function (ev) {
    return (0, _tinycolor2.default)(ev.target.value).isValid();
  }).map(function (ev) {
    return setStateFromInput({ value: ev.target.value });
  });

  var inputSwitcher$ = DOM.select('.switcher').events('click').map(changeColorInputFormat);

  var setStateFromProps$ = props$.map(setStateFromProps);

  return _xstream2.default.merge(setStateFromProps$, setStateFromHexInput$, inputSwitcher$, mouseUp$, makeInputElementReducer$('saturation', DOM), makeInputElementReducer$('hue', DOM), makeInputElementReducer$('alpha', DOM), makeTextInputElementReducer$('hsla', DOM), makeTextInputElementReducer$('rgba', DOM));
}