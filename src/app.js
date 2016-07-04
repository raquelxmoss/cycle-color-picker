import {input, div, button, p, span} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {either} from './helpers';
import {renderSaturationInput, renderHueInput, renderAlphaInput, renderSwatch} from './views';
import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Tidy up calls to tinycolor and make sure they aren't mutating state. Also use tinycolor.fromRatio to simplify a bunch of shit.
// - Fix indicators overshooting by 10px
// - Pretty up the CSS
// - Add Hex/RGBA/HSL to display
//  - Allow users to cycle between them
//  - Make them copyable inputs
// - Allow pasting in of Hex/RGBA
// - Allow clicking on components (rather than just drag)
// - Test
// - Publish to NPM
//
//
// TODO right now:
// - render current color as HEX
// - render current color as HEX in an input that can be copied from
// - allow HEX input to update the color
// - allow user to switch to rgba input mode
// - automatically switch to rgba input mode if alpha < 1
//
function renderRGBAElement (rgba, channel) {
  return (
    input('.rgba-input',
      {
        attributes: {
          value: rgba[channel],
          'data-channel': channel
        }
      }
    )
  );
}

function renderColorInput (state) {
  const format = state.colorInputFormat.value
  const color = tinycolor.fromRatio(state.color);

  if (format === 'hex') {
    return input('.hex-input', {type: 'text', value: tinycolor(color).toHexString()})
  } else if (format === 'rgba') {
    const rgba = color.toRgb();

    return (
      div('.rgba', [
        span('r'),
        renderRGBAElement(rgba, 'r'),
        span('g'),
        renderRGBAElement(rgba, 'g'),
        span('b'),
        renderRGBAElement(rgba, 'b'),
        span('a'),
        renderRGBAElement(rgba, 'a')
      ])
    )
  }
}

function view (state) {
  return (
    div('.color-picker', [
      renderSaturationInput(state),
      renderHueInput(state),
      renderAlphaInput(state),
      renderSwatch(state),
      renderColorInput(state)
    ])
  );
}

export default function ColorPicker ({DOM, Mouse, props$ = Observable.empty()}) {
  const initialState = {
    dragging: either(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    alphaContainer: {width: 0},

    color: {h: 0, s: 0, v: 1, a: 1},
    colorInputFormat: either(['hex', 'rgba', 'hsla'], 'rgba')
  };

  const action$ = makeReducer$({DOM, Mouse, props$});

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state))
    .shareReplay(1)
    .distinctUntilChanged(JSON.stringify);

  const color$ = state$.map(state => {
    return tinycolor({...state.color, h: state.color.h * 360}).toRgbString();
  }).distinctUntilChanged()

  return {
    DOM: state$.map(view),
    color$
  };
}
