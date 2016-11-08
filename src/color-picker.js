import xs from 'xstream';
import dropRepeats from 'xstream/extra/droprepeats';
import tinycolor from 'tinycolor2';
import { div } from '@cycle/dom';

import SaturationValue from './components/saturation-value';
import Hue from './components/hue';
import Alpha from './components/alpha';

function view ([alpha]) {
  const swatch = div('.swatchy', {style: {
    width: '100px',
    height: '100px'
    // background: tinycolor.fromRatio(state.color).toRgbString()
  }});

  return (
    div('.color-picker', [
      alpha,
      swatch
    ])
  );
}

function updateColor (value) {
  return function _updateColor (state) {
    const newColor = Object.assign({}, state.color, value);

    return Object.assign({}, state, {color: newColor});
  };
}

function setStateFromProps (props) {
  return function _setStateFromProps (state) {
    if ('color' in props) {
      props.color = tinycolor(props.color).toHsv();
    }

    return {
      ...state,

      ...props
    };
  };
}

export default function ColorPicker ({DOM, props$ = xs.empty()}) {
  // const initialState = {color: {h: 0, s: 0, v: 0, a: 0}};
  //
  const alphaComponent$ = Alpha({DOM, props$});
  const alpha$ = alphaComponent$.alpha$;

  // const state$ = action$
  //   .fold((state, action) => action(state), initialState)
  //   .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b))) // there's a thing in lodash for this maybe
  //   .remember();

  // const color$ = state$
  //   .map(state => tinycolor.fromRatio(state.color).toRgbString());

  return {
    DOM: alphaComponent$.DOM,
    alpha$
  };
}
