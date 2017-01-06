import tinycolor from 'tinycolor2';
import css from 'stylin';
import _ from 'lodash';
import {div, input, span, p} from '@cycle/dom';

import {isInt} from './helpers';
import {styles} from './styles/color-picker';

function renderSwatch (state) {
  const color = tinycolor.fromRatio(state.color);

  const swatchBackground = color.clone().setAlpha(state.color.a);
  const swatchStyle = {'background-color': tinycolor(swatchBackground).toRgbString()};

  return (
    div('.swatch', [
      div('.swatch-underlay', [
        div('.swatch-color', {style: swatchStyle})
      ])
    ])
  );
}

export default function view (state) {
  return (
    div(`.color-picker ${css.unimportant(styles)}`, [
      renderSaturationInput(state),
      div('.controls-container', [
        renderSwatch(state),
      ]),
      div('.inputs-container', [
        renderColorInputs(state),
        renderInputSwitcher(state)
      ])
    ])
  );
}
