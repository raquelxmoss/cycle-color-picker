import {input, div, button, p} from '@cycle/dom';
import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

function containerBoundaries (state, event) {
  // ReactColor uses clientWidth and clientHeight here. There's probably a reason for that, so if there's a bug, try changing this.
  const containerWidth = state.saturationContainer.width;
  const containerHeight = state.saturationContainer.height;
  const containerLeft = state.saturationContainer.left;
  const containerTop = state.saturationContainer.top;

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

function updateSaturation (event) {
  return state => {
    if (!state.saturationIsDragging) { return state; }

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

function updateSaturationIndicatorPosition (event) {
  return state => {
    if (!state.saturationIsDragging) { return state; }

    const left = event.clientX;
    const top = event.clientY;

    const {
      isInBounds,
      containerWidth,
      containerHeight,
      containerTop,
      containerLeft
    } = containerBoundaries(state, event);

    const saturationIndicatorPosition = {
      left: between(0, containerWidth + containerLeft, left) - containerLeft,
      top: between(0, containerHeight + containerTop, top) - containerTop
    };

    return Object.assign(state, {}, {saturationIsDragging: true, saturationIndicatorPosition});
  };
}

function view (state) {
  const saturationIndicatorColor = tinycolor.mix('#fff', '#000', parseFloat(state.color.l)).toHexString();

  const saturationIndicatorStyle = {
    left: `${state.saturationIndicatorPosition.left}px`,
    top: `${state.saturationIndicatorPosition.top}px`,
    'border-color': saturationIndicatorColor
  };

  const swatchStyle = {background: tinycolor(state.color).toHexString()};

  return div('.container', [
    div('.color-picker', [
      div('.saturation', [
        div('.color-overlay'),
        div('.color'),
        div('.black'),
        div('.indicator', {style: saturationIndicatorStyle})
      ])
    ]),
    div('.swatch', {style: swatchStyle})
  ]);
}

export default function App ({DOM, Keys}) {
  const mouseUp$ = DOM
    .select(':root')
    .events('mouseup')
    .map(ev => state => Object.assign({}, state, {saturationIsDragging: false}));

  const saturation = DOM
    .select('.saturation');

  const saturationMouseDown$ = saturation
    .events('mousedown')
    .map(ev => state => Object.assign({}, state, {saturationIsDragging: true}));

  const saturationMouseMove$ = saturation
    .events('mousemove');

  const updateSaturation$ = saturationMouseMove$
    .map(ev => updateSaturation(event));

  const updateSaturationIndicatorPosition$ = saturationMouseMove$
    .map(ev => updateSaturationIndicatorPosition(ev));

  const saturationContainerDimensions$ = saturation
    .observable
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => Object.assign({}, state, {saturationContainer: value}))
    .take(1);

  const initialState = {
    saturationContainer: null,
    saturationIsDragging: false,
    saturationIndicatorPosition: {
      left: 0,
      top: 0
    },
    color: tinycolor('white').toHsl()
 };

  const action$ = Observable.merge(
    mouseUp$,
    saturationMouseDown$,
    updateSaturation$,
    updateSaturationIndicatorPosition$,
    saturationContainerDimensions$
  );

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(view)
  };
}
