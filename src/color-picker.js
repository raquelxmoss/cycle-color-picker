import xs from 'xstream';
import dropRepeats from 'xstream/extra/droprepeats';
import tinycolor from 'tinycolor2';

import {either} from './helpers';
import view from './view';
import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Make sure bundle works
// - Publish to NPM

export default function ColorPicker ({DOM, props$ = xs.empty()}) {
  const initialState = {
    activeInput: either(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    alphaContainer: {width: 0},

    color: {h: 0, s: 0, v: 1, a: 1},
    colorInputFormat: either(['hex', 'rgba', 'hsla'], 'hex')
  };

  const action$ = makeReducer$({DOM, props$});

  const state$ = action$
    .fold((state, action) => action(state), initialState)
    .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b))) // TODO do this better
    .remember();

  const color$ = state$
    .map(state => {
      return tinycolor.fromRatio(state.color).toRgbString();
    });

  return {
    DOM: state$.map(view),
    color$
  };
}
