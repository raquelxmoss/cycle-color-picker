import tinycolor from 'tinycolor2';
import {div, input, span, p} from '@cycle/dom';

function renderRGBAElement (rgba, channel) {
  return (
    input('.rgba-input',
      {
        attributes: {
          value: rgba[channel],
          'data-channel': channel
        }
      }
    )
  );
}

export function renderColorInput (state) {
  const format = state.colorInputFormat.value;
  const color = tinycolor.fromRatio(state.color);

  if (format === 'hex') {
    return input('.hex-input', {type: 'text', value: tinycolor(color).toHexString()});
  } else if (format === 'rgba') {
    const rgba = color.toRgb();

    return (
      div('.rgba', [
        span('r'),
        renderRGBAElement(rgba, 'r'),
        span('g'),
        renderRGBAElement(rgba, 'g'),
        span('b'),
        renderRGBAElement(rgba, 'b'),
        span('a'),
        renderRGBAElement(rgba, 'a')
      ])
    );
  }
}

export function renderInputSwitcher (state) {
  return (
    div('.input-switcher', [
      p('.switcher', '˄'),
      p('.switcher', '˅')
    ])
  );
}

export function renderSaturationInput (state) {
  const saturationBackground = `hsl(${state.color.h * 360}, 100%, 50%)`;
  const saturationIndicatorColor = tinycolor.mix('#fff', '#000', state.color.v * 100).toHexString();

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
