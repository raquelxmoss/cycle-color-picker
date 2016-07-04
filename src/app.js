import {div} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {either} from './helpers';
import {renderSaturationInput, renderHueInput, renderAlphaInput, renderSwatch} from './views';
import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Fix indicators overshooting by 10px
// - Pretty up the CSS (add SASS, move some things to JS, that kinda thing)
// - Add Hex/RGBA/HSL to display
// - Allow clicking on components (rather than just drag)
// - Test
// - Publish to NPM

function view (state) {
  return (
    div('.color-picker', [
      renderSaturationInput(state),
      renderHueInput(state),
      renderAlphaInput(state),
      renderSwatch(state)
    ])
  );
}

export default function ColorPicker ({DOM, Mouse, props$ = Observable.empty()}) {
  const initialState = {
    dragging: either(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    alphaContainer: {width: 0},

    color: {h: 0, s: 0, v: 1, a: 1}
  };

  const action$ = makeReducer$({DOM, Mouse, props$});

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state))
    .shareReplay(1);

  const color$ = state$.map(state => {
    return tinycolor({...state.color, h: state.color.h * 360}).toRgbString();
  }).distinctUntilChanged();

  return {
    DOM: state$.map(view),
    color$
  };
}
