import tinycolor from 'tinycolor2';

export function containerBoundaries (state, event, type) {
  const container = state[`${type}Container`];

  const containerWidth = container.width;
  const containerHeight = container.height;
  const containerLeft = container.left;
  const containerTop = container.top;

  // TODO: don't use window here Raquel you dork
  const left = (event.touches ? event.touches[0].pageX: event.pageX) - (containerLeft + window.scrollX);
  const top = (event.touches ? event.touches[0].pageY: event.pageY) - (containerTop + window.scrollY);

  return {
    containerWidth,
    containerHeight,
    top,
    left
  };
}

export function between (min, max, value) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

export function either (values, currentValue) {
  return {
    set: (newValue) => {
      if (!values.find(value => value === newValue)) {
        throw new Error(`newValue must be one of ${values.join(', ')}, got "${newValue}"`);
      }

      return either(values, newValue);
    },

    is: (value) => value === currentValue,
    value: currentValue
  };
}

export function getColorFromHex (hex) {
  const color = tinycolor(hex).toHsv();

  return color;
}

export function getColorFromRGBA (state, channel, value) {
  const color = tinycolor.fromRatio(state.color).toRgb();
  color[channel] = value;

  return color;
}

export function getColorFromHSLA (state, channel, value) {
  const color = tinycolor.fromRatio(state.color).toHsl();
  color[channel] = value;

  return color;
}

export function isInt (n) {
  return n % 1 === 0;
}
