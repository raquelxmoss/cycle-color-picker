import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import { swatch } from '../styles/swatch';
import css from 'stylin';

function view (color) {
  const c = tinycolor.fromRatio(color);

  const swatchBackground = c.clone().setAlpha(color.a);

  const col = tinycolor(swatchBackground).toRgbString();

  const style = { 'background-color': col };

  return (
    div(`.swatch ${css.unimportant(swatch)}`, [
      div('.swatch-underlay', [
        div('.swatch-color', { style })
      ])
    ])
  );
}

export default function Swatch ({DOM, color$}) {
  return {
    DOM: color$.map(view)
  };
}
