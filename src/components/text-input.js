// takes in a color and a format
// listens to input
// converts it into a color
// sends it back up to the parent
// also you can cycle through the inputs, but that doesn't affect the outside world, that's internal state
//
// Props: color, format

import xs from 'xstream';
import debounce from 'xstream/extra/debounce';
import tinycolor from 'tinycolor2';
import { input, div, span } from '@cycle/dom';

import { isInt } from '../helpers';

const colorInputViews = {
  hex: (color) => hexView(color.toHexString()),
  rgba: (color) => colorInputView(color.toRgb()),
  hsla: (color) => colorInputView(color.toHsl())
};

function makeInputElement (inputType, color, channel) {
  const value = isInt(color[channel]) ? color[channel] : color[channel].toFixed(2);

  return (
    input(
      `.${inputType}-input .text-input`,
      {
        props: {
          value,
          'data-channel': channel
        }
      }
    )
  );
}

function colorInputView (color) {
  const inputType = Object.keys(color);

  return (
      div('.color-input-container',
        inputType.map((channel) => {
          return div('.channel-container', [
            makeInputElement(inputType, color, channel),
            span(channel)
          ]);
        }
      )
    )
  );
}

function hexView (color) {
  return input('.hex-input', {props: {type: 'text', value: color}});
}

function view (color) {
  const format = 'hsla'; // either hex, rgba, hsla

  return div('.color-display', [
    colorInputViews[format](tinycolor(color))
  ]);
}

function colorFromInput (colorString) {
  const color = tinycolor(colorString);

  if (!color.isValid()) { return; }

  return color.toHexString();
}

export default function TextInput ({DOM, color$}) {
  const input$ = DOM
    .select('.color-input-container input')
    .events('input')
    .compose(debounce(300))
    .map(ev => ev.target.value);

  const colorFromProps$ = color$.map(color => tinycolor.fromRatio(color).toHexString());

  const colorFromInput$ = input$.map(colorFromInput);

  const colorChange$ = xs.merge(
    colorFromProps$,
    colorFromInput$
  ).startWith('#FFFFFF');

  return {
    DOM: colorChange$.map(view),
    change$: colorFromInput$.map(color => tinycolor(color).toHsv())
  };
}
