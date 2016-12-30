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
import {input} from '@cycle/dom';

function view (color) {
  return input('.hex-input', {props: {type: 'text', value: color}});
}

function colorFromInput (colorString) {
  const color = tinycolor(colorString);

  if (!color.isValid()) { return; }

  return color.toHexString();
}

export default function TextInput ({DOM, color$}) {
  const input$ = DOM
    .select('.hex-input')
    .events('input')
    .compose(debounce(300))
    .map(ev => ev.target.value);

  const hexFromProps$ = color$.map(color => tinycolor.fromRatio(color).toHexString());

  const hexFromInput$ = input$.map(colorFromInput);

  const hex$ = xs.merge(
    hexFromProps$,
    hexFromInput$
  ).startWith('#FFFFFF').debug();

  return {
    DOM: hex$.map(view),
    change$: hexFromInput$.map(color => tinycolor(color).toHsv())
  };
}

// function makeInputElement (inputType, color, channel) {
//   const value = isInt(color[channel]) ? color[channel] : color[channel].toFixed(2);

//   return (
//     input(
//       `.${inputType}-input .text-input`,
//       {
//         props: {
//           value,
//           'data-channel': channel
//         }
//       }
//     )
//   );
// }

// function colorInputView (color) {
//   const inputType = Object.keys(color).join('');

//   return (
//       div('.color-input-container',
//         color.map((value, channel) => {
//           return div('.channel-container', [
//             makeInputElement(inputType, color, channel),
//             span(channel)
//           ]);
//         }
//       )
//     )
//   );
// }

// function hexView (color) {
// }

// const colorInputViews = {
//   hex: (color) => hexView(color.toHexString()),
//   rgba: (color) => colorInputView(color.toRgb()),
//   hsla: (color) => colorInputView(color.toHsl())
// };

// function renderColorInputs (state) {
//   const format = state.colorInputFormat.value;
//   const color = tinycolor.fromRatio(state.color);

//   return div('.color-display', [
//     colorInputViews[format](color)
//   ]);
// }
