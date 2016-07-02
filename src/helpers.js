export function containerBoundaries (state, event, type) {
  // ReactColor uses clientWidth and clientHeight here. There's probably a reason for that, so if there's a bug, try changing this.
  const container = state[`${type}Container`];

  const containerWidth = container.width;
  const containerHeight = container.height;
  const containerLeft = container.left;
  const containerTop = container.top;

  const left = event.pageX - containerLeft;
  const top = event.pageY - containerTop;

  const isInBounds = left > 0 && top > 0 && left < containerWidth && top < containerHeight;

  return {
    isInBounds,
    containerWidth,
    containerHeight,
    containerLeft,
    containerTop,
    top,
    left
  };
}
