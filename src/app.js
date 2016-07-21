import {div} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {either} from './helpers';

import view from './view';
import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Make scss more sensible
// - Test
// - Make sure bundle works
// - Publish to NPM
//
// TODO would be really nice but not entirely MVP:
// - automatically switch to rgba input mode if alpha < 1

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
