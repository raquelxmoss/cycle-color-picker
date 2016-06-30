import {input, div, button, p} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

function containerBoundaries (state, event) {
  // ReactColor uses clientWidth and clientHeight here. There's probably a reason for that, so if there's a bug, try changing this.
  const containerWidth = state.container.width;
  const containerHeight = state.container.height;
  const containerLeft = state.container.left;
  const containerTop = state.container.top;

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

function updateColor (event) {
  return state => {
    if (!state.isDragging) { return state; }

    const {
      isInBounds,
      containerLeft,
      containerTop,
      containerWidth,
      containerHeight,
      top,
      left
    } = containerBoundaries(state, event);

    if (isInBounds) {
      const saturation = left * 100 / containerWidth;
      const bright = -(top * 100 / containerHeight) + 100;
      const computed = tinycolor({h: 307, s: saturation, v: bright }).toHsl();

      return Object.assign(
        {},
        state,
        {color: computed}
      );
    }

    return state;
  };
}

function between (min, max, value) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function updateIndicatorPosition (event) {
  return state => {
    if (!state.isDragging) { return state; }

    const left = event.clientX;
    const top = event.clientY;

    const {
      isInBounds,
      containerWidth,
      containerHeight,
      containerTop,
      containerLeft
    } = containerBoundaries(state, event);

    const indicatorPosition = {
      left: between(0, containerWidth + containerLeft, left) - containerLeft,
      top: between(0, containerHeight + containerTop, top) - containerTop
    };

    return Object.assign(state, {}, {isDragging: true, indicatorPosition});
  };
}

function view (state) {
  const indicatorColor = tinycolor.mix('#fff', '#000', parseFloat(state.color.l)).toHexString();

  const indicatorStyle = {
    left: `${state.indicatorPosition.left}px`,
    top: `${state.indicatorPosition.top}px`,
    'border-color': indicatorColor
  };

  const swatchStyle = {background: tinycolor(state.color).toHexString()};

  return div('.container', [
    div('.color-picker', [
      div('.color-overlay'),
      div('.color'),
      div('.black'),
      div('.indicator', {style: indicatorStyle})
    ]),
    div('.swatch', {style: swatchStyle})
  ]);
}

export default function App ({DOM, Keys}) {
  const colorPicker = DOM
    .select('.color-picker');

  const mouseDown$ = colorPicker
    .events('mousedown')
    .map(ev => state => Object.assign({}, state, {isDragging: true}));

  const mouseUp$ = DOM
    .select(':root')
    .events('mouseup')
    .map(ev => state => Object.assign({}, state, {isDragging: false}));

  const mouseMove$ = colorPicker
    .events('mousemove');

  const updateColor$ = mouseMove$
    .map(ev => updateColor(event));

  const updateIndicatorPosition$ = mouseMove$
    .map(ev => updateIndicatorPosition(ev));

  const containerDimensions$ = colorPicker
    .observable
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => Object.assign({}, state, {container: value}))
    .take(1);

  const initialState = {
    container: null,
    isDragging: false,
    indicatorPosition: {
      left: 0,
      top: 0
    },
    color: tinycolor('white').toHsl()
 };

  const action$ = Observable.merge(
    mouseDown$,
    mouseUp$,
    updateColor$,
    updateIndicatorPosition$,
    containerDimensions$
  );

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
