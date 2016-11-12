import xs from 'xstream';
import tinycolor from 'tinycolor2';
import { div } from '@cycle/dom';

import SaturationValue from './components/saturation-value';
import Hue from './components/hue';
import Alpha from './components/alpha';

function view ([saturationValue, hue, alpha, color]) {
  const swatch = div('.swatchy', {style: {
    width: '100px',
    height: '100px',
    background: tinycolor.fromRatio(color).toRgbString()
  }});

  return (
    div('.color-picker', [
      saturationValue,
      hue,
      alpha,
      swatch
    ])
  );
}

function colorFromProps (props) {
  if ('color' in props) {
    const color = tinycolor(props).toHsv();
    color.h /= 360;

    return color;
  }
}

function calculateColor ([{saturation, value}, hue, alpha]) {
  const color = {
    h: hue,
    s: saturation,
    v: value,
    a: alpha
  };

  return color;
}

export default function ColorPicker ({DOM, props$ = xs.empty()}) {
  const colorFromProps$ = props$.map(colorFromProps);

  const colorProxy$ = xs.create();

  const saturationValueComponent$ = SaturationValue({DOM, color$: xs.of('pink')});
  const hueComponent$ = Hue({DOM, color$: xs.of('pink')});
  const alphaComponent$ = Alpha({DOM, color$: xs.of('pink')});

  const saturationValue$ = saturationValueComponent$.saturationValue$;
  const hue$ = hueComponent$.hue$;
  const alpha$ = alphaComponent$.alpha$;

  const color$ = xs.combine(
    saturationValue$,
    hue$,
    alpha$,
    colorFromProps$
  ).map(calculateColor);

  // colorProxy$.imitate(color$);

  const vtree$ = xs.combine(
    saturationValueComponent$.DOM,
    hueComponent$.DOM,
    alphaComponent$.DOM,
    color$
  );

  const colorSink$ = color$.map(color => tinycolor.fromRatio(color).toRgbString());

  return {
    DOM: vtree$.map(view),
    color$ : colorSink$
  };
}
