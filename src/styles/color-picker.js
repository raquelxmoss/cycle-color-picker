import {
  colorDisplay,
  colorInputContainer,
  channelContainer,
  colorInput,
  inputsContainer,
  hexInput,
  controlsContainer,
  sliders,
  hueContainer,
  alphaContainer,
  hueStyle,
  sliderIndicator,
  alphaStyle,
  swatchStyle,
  switcherStyle
} from '../styles';

import {saturation} from './saturation';

export const styles = {
  'width': '255px',
  'height': '250px',
  'background': '#EEE',
  'border-radius': '2px',
  'box-shadow': 'rgba(0, 0, 0, 0.298039) 0px 0px 2px, rgba(0, 0, 0, 0.298039) 0px 4px 8px',
  'font-family': 'Helvetica, sans-serif',
  '.color-display': colorDisplay,
  '.color-input-container': colorInputContainer,
  '.channel-container': channelContainer,
  '.color-input': colorInput,
  '.inputs-container': inputsContainer,
  '.hex-input': hexInput,
  '.controls-container': controlsContainer,
  '.saturation': saturation,
  '.sliders': sliders,
  '.hue-container': hueContainer,
  '.alpha-container': alphaContainer,
  '.hue': hueStyle,
  '.hue-indicator': sliderIndicator,
  '.alpha-indicator': sliderIndicator,
  '.alpha': alphaStyle,
  '.swatch': swatchStyle,
  '.input-switcher': switcherStyle
};
