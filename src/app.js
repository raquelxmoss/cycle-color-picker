import {div} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {either} from './helpers';

import {
  renderSaturationInput,
  renderHueInput,
  renderAlphaInput,
  renderSwatch,
  renderColorInput,
  renderInputSwitcher
} from './views';

import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Fix indicators overshooting by 10px (transform translate in the CSS)
// - Make scss more sensible
// - DRY up how the inputs work
// - ADD SOME CONSTANTS
// - Test
// - Make sure bundle works
// - Publish to NPM
//
// TODO refactors:
// - Tidy up inputs and switcher stuff, it's quite naive at the moment, it could be abstracted more
//
// TODO would be really nice but not entirely MVP:
// - automatically switch to rgba input mode if alpha < 1

function view (state) {
  return (
    div('.color-picker', [
      renderSaturationInput(state),
      div('.controls-container', [
        renderSwatch(state),
        div('.sliders', [
          renderHueInput(state),
          renderAlphaInput(state)
        ])
      ]),
      div('.inputs-container', [
        renderColorInput(state),
        renderInputSwitcher(state)
      ])
    ])
  );
}

export default function ColorPicker ({DOM, Mouse, props$ = Observable.empty()}) {
  const initialState = {
    activeInput: either(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    alphaContainer: {width: 0},

    color: {h: 0, s: 0, v: 1, a: 1},
    colorInputFormat: either(['hex', 'rgba', 'hsla'], 'hex')
  };

  const action$ = makeReducer$({DOM, Mouse, props$});

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state))
    .shareReplay(1)
    .distinctUntilChanged(JSON.stringify);

  const color$ = state$
    .map(state => {
      return tinycolor.fromRatio(state.color).toRgbString();
    })
    .distinctUntilChanged();

  return {
    DOM: state$.map(view),
    color$
  };
}
