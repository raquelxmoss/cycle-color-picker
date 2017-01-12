import xs from 'xstream';
import debounce from 'xstream/extra/debounce';
import dropRepeats from 'xstream/extra/dropRepeats';
import sampleCombine from 'xstream/extra/sampleCombine';
import tinycolor from 'tinycolor2';
import { input, div, span, p } from '@cycle/dom';
import _ from 'lodash';
import css from 'stylin';

import { isInt } from '../helpers';
import { inputs } from '../styles/inputs';
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
      `.${inputType.join('')}-input .text-input .color-input`,
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
    '.text-input .hex-input',
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
  return div(`.color-display ${css.unimportant(inputs)}`, [
    colorInputViews[format](tinycolor(color)),
    renderInputSwitcher()
  ]);
}

function colorFromInput ([input, format]) {
  const [old, change] = input;
  var color;

  if (format === 'hex') {
    color = old[0].value;
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

function dropElRepeats (a, b) {
  if (b[0] === undefined) { return false; }

  return a[0] === b[0];
}

export default function TextInput ({DOM, color$}) {
  const inputChannels$ = DOM
    .select('.text-input')
    .elements()
    .compose(dropRepeats((a, b) => dropElRepeats(a, b)))
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

  // when the format changes, recalculate the color
  const colorFromProps$ = color$.map(color => tinycolor.fromRatio(color).toHsv());

  const colorFromInput$ = input$
    .compose(sampleCombine(format$))
    .map(colorFromInput);

  const colorChange$ = xs.merge(colorFromProps$, colorFromInput$)
    .startWith({h: 1, s: 1, v: 1, a: 1});

  return {
    DOM: xs.combine(colorChange$, format$).map(view),
    change$: colorFromInput$.map(color => tinycolor(color).toHsv())
  };
}
