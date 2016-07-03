import {input, div, button, p} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {either} from './helpers';
import {renderSaturationInput, renderHueInput, renderAlphaInput, renderSwatch} from './views';
import makeReducer$ from './reducers';

// TODO:
// - Eat food (don't work on this while you're hungry)
// - Fix indicators overshooting by 10px
// - Pretty up the CSS
// - Set starting state
// - Add Hex/RGBA display
// - Allow pasting in of Hex/RGBA
// - Allow clicking on components (rather than just drag)

function view (state) {
  return (
    div('.container', [
      div('.color-picker', [
        renderSaturationInput(state),
        renderHueInput(state),
        renderAlphaInput(state)
      ]),

      renderSwatch(state)
    ])
  );
}

export default function App ({DOM, Mouse}) {
  const initialState = {
    dragging: either(['none', 'hue', 'saturation', 'alpha'], 'none'),

    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    alphaContainer: {width: 0},

    color: {h: 0, s: 0, v: 1, a: 1}
  };

  const action$ = makeReducer$({DOM, Mouse});

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
