import xs from 'xstream';
import tinycolor from 'tinycolor2';
import { div } from '@cycle/dom';
import css from 'stylin';

import SaturationValue from './components/saturation-value';
import Hue from './components/hue';
import Alpha from './components/alpha';

import { styles } from './styles/color-picker.js';

function view ([saturationValue, hue, alpha, color]) {
  const swatch = div('.swatchy', {style: {
    width: '20px',
    height: '20px',
    background: tinycolor.fromRatio(color).toRgbString()
  }});

  return (
    div(`.color-picker ${css.unimportant(styles)}`, [
      saturationValue,
      hue,
      alpha,
      swatch
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

export default function ColorPicker ({DOM, props$ = xs.empty()}) {
  const colorFromProps$ = props$.map(colorFromProps);
  const colorChangeProxy$ = xs.create();

  const colorChange$ = xs.merge(
    colorFromProps$,
    colorChangeProxy$
  );

  const color$ = colorChange$.fold((color, change) => Object.assign({}, color, change), {h: 1, s: 1, v: 1, a: 1});

  const saturationValueComponent$ = SaturationValue({DOM, color$});
  const hueComponent$ = Hue({DOM, color$});
  const alphaComponent$ = Alpha({DOM, color$});

  const change$ = xs.merge(
    saturationValueComponent$.change$,
    hueComponent$.change$,
    alphaComponent$.change$
  );

  colorChangeProxy$.imitate(change$);

  const vtree$ = xs.combine(
    saturationValueComponent$.DOM,
    hueComponent$.DOM,
    alphaComponent$.DOM,
    color$
  );

  const colorSink$ = color$.map(color => tinycolor.fromRatio(color).toRgbString());

  return {
    DOM: vtree$.map(view),
    color$: colorSink$
  };
}
