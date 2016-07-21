import tinycolor from 'tinycolor2';
import _ from 'lodash';
import {div, input, span, p} from '@cycle/dom';

const colorInputViews = {
  hex: (color) => renderHexInputElement(color.toHexString()),
  rgba: (color) => renderColorInputElement(color.toRgb()),
  hsla: (color) => renderColorInputElement(color.toHsl())
};

function makeInputElement (inputType, color, channel) {
  return (
    input(
      `.${inputType}-input .color-input`,
      {
        attributes: {
          value: color[channel],
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
      _.map(color, (value, channel) => {
        return div('.channel-container', [
          makeInputElement(inputType, color, channel),
          span(channel)
        ]);
      })
    )
  );
}

function renderHexInputElement (color) {
  return input('.hex-input', {type: 'text', value: color});
}

export function renderColorInput (state) {
  const format = state.colorInputFormat.value;
  const color = tinycolor.fromRatio(state.color);

  return div('.color-display', [
    colorInputViews[format](color)
  ]);
}

export function renderInputSwitcher (state) {
  return (
    div('.input-switcher', [
      p('.switcher .switcher-up'),
      p('.switcher .switcher-down')
    ])
  );
}

export function renderSaturationInput (state) {
  const saturationBackground = `hsl(${state.color.h * 360}, 100%, 50%)`;
  const saturationIndicatorColor = state.color.v < 0.5 ? '#fff' : '#000';

  const saturationIndicatorStyle = {
    // TODO - calculate offset for centering
    left: `${state.saturationContainer.width * state.color.s - 6}px`,
    top: `${state.saturationContainer.height * (1 - state.color.v) - 5}px`,
    'border-color': saturationIndicatorColor
  };

  return (
    div('.saturation', [
      div('.color-overlay'),
      div('.color', {style: {background: saturationBackground}}),
      div('.black'),
      div('.indicator', {style: saturationIndicatorStyle})
    ])
  );
}

export function renderHueInput (state) {
  const hueIndicatorStyle = {
    left: `${state.hueContainer.width * state.color.h - 5}px`
  };

  return (
    div('.hue-container', [
      div('.hue', [
        div('.hue-indicator', {style: hueIndicatorStyle})
      ])
    ])
  );
}

export function renderAlphaInput (state) {
  const alphaIndicatorStyle = {
    left: `${state.alphaContainer.width * state.color.a - 5}px`
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

export function renderSwatch (state) {
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
