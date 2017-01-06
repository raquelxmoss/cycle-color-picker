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
import { input, div, span, p } from '@cycle/dom';

import { isInt } from '../helpers';
import downArrow from '../icons/arrow-down.svg';
import upArrow from '../icons/arrow-up.svg';

const colorInputViews = {
  hex: (color) => hexView(color.toHexString()),
  rgba: (color) => colorInputView(color.toRgb()),
  hsla: (color) => colorInputView(color.toHsl())
};

function renderInputSwitcher () {
  return (
    div('.input-switcher', [
      p('.switcher .up', [upArrow]),
      p('.switcher .down', [downArrow])
    ])
  );
}

function changeColorInputFormat (current, change) {
  const inputFormats = ['rgba', 'hex', 'hsla'];
  const currentInput = inputFormats.indexOf(current);
  const newInput = ((currentInput + 1) % inputFormats.length + inputFormats.length) % inputFormats.length;

  return inputFormats[newInput];
}

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

function view ([color, format]) {
  return div('.color-display', [
    colorInputViews[format](tinycolor(color)),
    renderInputSwitcher()
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

  const format$ = DOM
    .select('.switcher')
    .events('click')
    .fold(changeColorInputFormat, 'hex');

  return {
    DOM: xs.combine(colorChange$, format$).map(view),
    change$: colorFromInput$.map(color => tinycolor(color).toHsv())
  };
}
