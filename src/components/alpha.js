import xs from 'xstream';
import { div } from '@cycle/dom';
import { between } from '../helpers';
import tinycolor from 'tinycolor2';

// view
function view ([state, props]) {
  const alphaIndicatorStyle = {
    left: `${state.container.width * state.alpha}px`
  };

  const color = tinycolor.fromRatio(props.color);
  const gradientStart = color.clone().setAlpha(0);
  const gradientStyle = {
    background: `linear-gradient(to right, ${tinycolor(gradientStart).toRgbString()}  0%, ${color.toHexString()} 100%)`
  };

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

// helper
function containerBoundaries (state, event) {
  const container = state.container;

  const containerWidth = container.width;
  const containerLeft = container.left;
  const left = event.pageX - (containerLeft + window.scrollX);

  return {
    containerWidth,
    left
  };
}

// model
function updateAlpha (event) {
  return function _updateAlpha (state) {
    const { containerWidth, left } = containerBoundaries(state, event);
    const alpha = between(0, containerWidth, left) / containerWidth;

    return Object.assign({}, state, {alpha});
  };
}

export default function Alpha ({DOM, props$}) {
  // intent
  const container$ = DOM
    .select('.alpha-container');

  const containerEl$ = container$
    .elements()
    .drop(2)
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => ({...state, container: value}));

  const mouseDown$ = container$
    .events('mousedown')
    .map(ev => state => Object.assign({}, state, {mouseIsDown: true}));

  const mouseMove$ = container$
    .events('mousemove')
    .map(ev => updateAlpha(ev));

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup')
    .map(ev => state => Object.assign({}, state, {mouseIsDown: false}));

  // model
  const initialState = {
    a: 1,
    mouseIsDown: false
  };

  const action$ = xs.combine(
    containerEl$,
    mouseDown$,
    mouseMove$,
    mouseUp$
  );

  const state$ = action$.fold((state, action) => action(state), initialState);

  return {
    DOM: xs.combine(state$, props$).map(view),
    alpha$: state$
  };
}
