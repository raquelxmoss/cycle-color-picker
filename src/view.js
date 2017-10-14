import tinycolor from 'tinycolor2';
import css from 'stylin';
import {div, input, span, p} from '@cycle/dom';

import {isInt} from './helpers';
import {styles} from './styles/color-picker';
import downArrow from './icons/arrow-down.svg';
import upArrow from './icons/arrow-up.svg';

const colorInputViews = {
  hex: (color) => renderHexInputElement(color.toHexString()),
  rgba: (color) => renderColorInputElement(color.toRgb()),
  hsla: (color) => renderColorInputElement(color.toHsl())
};

function makeInputElement (inputType, color, channel) {
  const value = isInt(color[channel]) ? color[channel] : color[channel].toFixed(2);

  return (
    input(
      `.${inputType}-input .color-input`,
      {
        props: {
          value,
          'data-channel': channel
        }
      }
    )
  );
}

function renderColorInputElement (color) {
  const inputType = Object.keys(color).join('');

  return (
      div('.color-input-container',
      color.map((value, channel) => {
        return div('.channel-container', [
          makeInputElement(inputType, color, channel),
          span(channel)
        ]);
      })
    )
  );
}

function renderHexInputElement (color) {
  return input('.hex-input', {props: {type: 'text', value: color}});
}

function renderColorInputs (state) {
  const format = state.colorInputFormat.value;
  const color = tinycolor.fromRatio(state.color);

  return div('.color-display', [
    colorInputViews[format](color)
  ]);
}

function renderInputSwitcher (state) {
  return (
    div('.input-switcher', [
      p('.switcher .up', [upArrow]),
      p('.switcher .down', [downArrow])
    ])
  );
}

function renderSaturationInput (state) {
  const saturationBackground = `hsl(${state.color.h * 360}, 100%, 50%)`;
  const saturationIndicatorColor = state.color.v < 0.5 ? '#fff' : '#000';

  const saturationIndicatorStyle = {
    left: `${state.saturationContainer.width * state.color.s}px`,
    top: `${state.saturationContainer.height * (1 - state.color.v)}px`,
    'border-color': `${saturationIndicatorColor}`
  };

  return (
    div('.saturation', [
      div('.white-overlay'),
      div('.saturation-color', {style: {background: saturationBackground}}),
      div('.grey-overlay'),
      div('.saturation-indicator', {style: saturationIndicatorStyle})
    ])
  );
}

function renderHueInput (state) {
  const hueIndicatorStyle = {
    left: `${state.hueContainer.width * state.color.h}px`
  };

  return (
    div('.hue-container', [
      div('.hue', [
        div('.hue-indicator', {style: hueIndicatorStyle})
      ])
    ])
  );
}

function renderAlphaInput (state) {
  const alphaIndicatorStyle = {
    left: `${state.alphaContainer.width * state.color.a}px`
  };

  const color = tinycolor.fromRatio(state.color);

  const gradientStart = color.clone().setAlpha(0);
  const gradientStyle = {background: `linear-gradient(to right, ${tinycolor(gradientStart).toRgbString()}  0%, ${color.toHexString()} 100%)`};

  return (
    div('.alpha-container', [
      div('.alpha', [
        div('.checkerboard'),
        div('.gradient-overlay', {style: gradientStyle}),
        div('.alpha-indicator', {style: alphaIndicatorStyle})
      ])
    ])
  );
}

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
        div('.sliders', [
          renderHueInput(state),
          renderAlphaInput(state)
        ])
      ]),
      div('.inputs-container', [
        renderColorInputs(state),
        renderInputSwitcher(state)
      ])
    ])
  );
}
