import tinycolor from 'tinycolor2';

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

export function isInt (n) {
  return n % 1 === 0;
}
