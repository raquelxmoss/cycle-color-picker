export function containerBoundaries (state, event, type) {
  // ReactColor uses clientWidth and clientHeight here. There's probably a reason for that, so if there's a bug, try changing this.
  const container = state[`${type}Container`];

  const containerWidth = container.width;
  const containerHeight = container.height;
  const containerLeft = container.left;
  const containerTop = container.top;

  const left = event.pageX - containerLeft;
  const top = event.pageY - containerTop;

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
