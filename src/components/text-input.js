import xs from 'xstream';
import debounce from 'xstream/extra/debounce';
import dropRepeats from 'xstream/extra/dropRepeats';
import tinycolor from 'tinycolor2';
import { input, div, span, p } from '@cycle/dom';
import _ from 'lodash';

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
      `.${inputType.join('')}-input .text-input`,
      {
        props: { value: value },
        attrs: {
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
  return input(
    '.text-input',
    {
      props: {
        value: color
      },
      attrs: {
        'data-channel': 'hex'
      }
    }
  );
}

function view ([color, format]) {
  return div('.color-display', [
    colorInputViews[format](tinycolor(color)),
    renderInputSwitcher()
  ]);
}

// TODO: make this better, this is awful
function colorFromInput ([input, format]) {
  const [old, change] = input;
  let color;

  if (format === 'hex') {
    color = change.value;
  } else {
    const indexToChange = _.findIndex(old, function (o) { return o.channel === change.channel; });

    old[indexToChange] = change;

    color = old.reduce((newColor, {channel, value}) => Object.assign(newColor, {[`${channel}`]: value}), {});
  }

  const colorFromInput = tinycolor(color);

  if (!colorFromInput.isValid()) { return; }

  return colorFromInput.toHsv();
}

function structureElement (element) {
  return { value: element.value, channel: element.getAttribute('data-channel') };
}

export default function TextInput ({DOM, color$}) {
  const inputChannels$ = DOM
    .select('.text-input')
    .elements()
    .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    .map(elements => elements.map(structureElement));

  const inputValue$ = DOM
    .select('.text-input')
    .events('input')
    .compose(debounce(300))
    .map(event => structureElement(event.target));

  const input$ = xs.combine(inputChannels$, inputValue$);

  const format$ = DOM
    .select('.switcher')
    .events('click')
    .fold(changeColorInputFormat, 'hex');

  const colorFromProps$ = color$.map(color => tinycolor.fromRatio(color).toHsv());

  const colorFromInput$ = xs.combine(input$, format$).map(colorFromInput);

  const colorChange$ = xs.merge(
    colorFromProps$,
    colorFromInput$
  ).startWith('#FFFFFF');

  return {
    DOM: xs.combine(colorChange$, format$).map(view),
    change$: colorFromInput$.map(color => tinycolor(color).toHsv())
  };
}
