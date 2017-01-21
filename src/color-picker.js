import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import tinycolor from 'tinycolor2';
import { div } from '@cycle/dom';
import css from 'stylin';
import onionify from 'cycle-onionify';
import isolate from '@cycle/isolate';

import SaturationValue from './components/saturation-value';
import Hue from './components/hue';
import Alpha from './components/alpha';
import TextInput from './components/text-input';
import Swatch from './components/swatch';

import { styles } from './styles/color-picker.js';

function view ([saturationValue, hue, alpha, text, swatch, color]) {
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
  if ('color' in props) {
    const color = tinycolor(props.color).toHsv();
    color.h /= 360;

    return color;
  }
}

function initialReducer (state) {
  return {h: 1, s: 1, v: 1, a: 1};
}

function ColorPicker ({DOM, onion, props$ = xs.empty()}) {
  const initialState$ = xs.of(initialReducer);
  const color$ = onion.state$.debug()

  const saturationValueComponent = isolate(SaturationValue, 'saturationValue')({DOM, color$});
  const hueComponent = isolate(Hue, 'hue')({DOM, color$});
  const alphaComponent = isolate(Alpha, 'alpha')({DOM, color$});
  const textComponent = isolate(TextInput, 'textInput')({DOM, color$});
  const swatchComponent = isolate(Swatch, 'swatch')({DOM, color$});

  const vtree$ = xs.combine(
    saturationValueComponent.DOM,
    hueComponent.DOM,
    alphaComponent.DOM,
    // textComponent.DOM,
    // swatchComponent.DOM,
    color$
  ).compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b)));

  const reducer$ = xs.merge(
    initialState$,
    saturationValueComponent.onion,
    hueComponent.onion,
    alphaComponent.onion
    // textComponent.onion,
    // swatchComponent.onion
  );

  const colorSink$ = color$.map(color => tinycolor.fromRatio(color).toRgbString());

  return {
    DOM: vtree$.map(view),
    color$: colorSink$,
    onion: reducer$
  };
}

export default onionify(ColorPicker);
