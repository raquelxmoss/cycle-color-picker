import tinycolor from 'tinycolor2';
import {div} from '@cycle/dom';

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

export function renderAlphaInput (state) {
  const alphaIndicatorStyle = {
    left: `${state.alphaContainer.width * state.color.a}px`
  };

  const color = tinycolor({...state.color, h: state.color.h * 360});

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
  const color = tinycolor({...state.color, h: state.color.h * 360});

  const swatchBackground = color.clone().setAlpha(state.color.a);
  const swatchStyle = {background: tinycolor(swatchBackground).toRgbString()};

  return (
    div('.swatch', {style: swatchStyle})
  );
}
