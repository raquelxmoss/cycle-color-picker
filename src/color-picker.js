import xs from 'xstream';
import dropRepeats from 'xstream/extra/droprepeats';
import tinycolor from 'tinycolor2';

import {either} from './helpers';
import view from './view';
import makeReducer$ from './reducers';

export default function ColorPicker ({DOM, props$ = xs.empty()}) {
  const initialState = {
    activeInput: either(['none', 'hue', 'saturation', 'alpha'], 'none'),
    saturationContainer: {width: 0, height: 0},
    hueContainer: {width: 0},
    color: props$.take(1).map(props => props.color),
    colorInputFormat: either(['hex', 'rgba', 'hsla'], 'hex')
  };


  // const saturation$ = SaturationLightness({DOM, props$ = xs.of(s, v)});
  // const hue$ = Hue({DOM, props$ = xs.of(h)});

  const action$ = makeReducer$({DOM, props$});

  const state$ = action$
    .fold((state, action) => action(state), initialState)
    .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b))) // TODO do this better
    .remember();

  const a$ = state$.map(state => state.color.a).take(1);
  const alpha$ = Alpha({DOM, props$: xs.of(a$)});

  const color$ = state$
    .map(state => {
      return tinycolor.fromRatio(state.color).toRgbString();
    });

  return {
    DOM: state$.map(view),
    color$
  };
}
