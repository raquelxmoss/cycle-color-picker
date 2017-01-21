import xs from 'xstream';
import tinycolor from 'tinycolor2';
import { div } from '@cycle/dom';
import css from 'stylin';
import onionify from 'cycle-onionify';

import SaturationValue from './components/saturation-value';
import Hue from './components/hue';
import Alpha from './components/alpha';
import TextInput from './components/text-input';
import Swatch from './components/swatch';

import { styles } from './styles/color-picker.js';

function view ([saturationValue, hue, alpha, text, swatch]) {
  return (
    div(`.color-picker ${css.unimportant(styles)}`, [
      saturationValue,
      div('.controls-container', [
        swatch,
        div('.sliders', [
          hue,
          alpha
        ])
      ]),
      text
    ])
  );
}

function colorFromProps (props) {
  return function colorFromProps () {
    if ('color' in props) {
      const color = tinycolor(props.color).toHsv();
      color.h /= 360;

      return color;
    }
  };
}

function composeColor (change) {
  return function composeColor (state) {
    return Object.assign({}, state, change);
  };
}

function ColorPicker ({DOM, onion, props$ = xs.empty()}) {
  const initialReducer$ = props$.map(props => colorFromProps(props));
  const color$ = onion.state$.debug();

  const saturationValueComponent = SaturationValue({DOM, color$});
  const hueComponent = Hue({DOM, color$});
  const alphaComponent = Alpha({DOM, color$});
  const textComponent = TextInput({DOM, color$});
  const swatchComponent = Swatch({DOM, color$});

  const composeColor$ = xs.merge(
    saturationValueComponent.change$,
    hueComponent.change$,
    alphaComponent.change$,
    textComponent.change$
  ).map(composeColor);

  const vtree$ = xs.combine(
    saturationValueComponent.DOM,
    hueComponent.DOM,
    alphaComponent.DOM,
    textComponent.DOM,
    swatchComponent.DOM,
    color$
  );

  const reducer$ = xs.merge(
    initialReducer$,
    composeColor$
  );

  const colorSink$ = color$.map(color => tinycolor.fromRatio(color).toRgbString());

  return {
    DOM: vtree$.map(view),
    onion: reducer$,
    color$: colorSink$
  };
}

export default onionify(ColorPicker);
