import xs from 'xstream';
import throttle from 'xstream/extra/throttle';
import dropRepeats from 'xstream/extra/dropRepeats';
import { div } from '@cycle/dom';
import { between } from '../helpers';
import tinycolor from 'tinycolor2';
import { alphaStyle } from '../styles/alpha';
import css from 'stylin';

// view
function view ([state, props]) {
  const alphaIndicatorStyle = {
    left: `${state.container.width * state.alpha}px`,
  };

  const color = tinycolor.fromRatio(props.color);
  const gradientStart = color.clone().setAlpha(0);
  const gradientStyle = {
    background: `linear-gradient(to right, ${tinycolor(gradientStart).toRgbString()}  0%, ${color.toHexString()} 100%)`
  };

  return (
    div(`.alpha-container ${css.unimportant(alphaStyle)}`, [
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
    if (!state.mouseIsDown) { return state; }

    const { containerWidth, left } = containerBoundaries(state, event);
    const alpha = between(0, containerWidth, left) / containerWidth;

    return Object.assign({}, state, {alpha});
  };
}

function setState (event, type, value) {
  return function _setState (state) {
    return {...state, [`${type}`]: value};
  };
}

export default function Alpha ({DOM, props$}) {
  const container$ = DOM
    .select('.alpha-container');

  const containerEl$ = container$
    .elements()
    .drop(1)
    .map(el => el[0].getBoundingClientRect())
    .map(value => setState('nil', 'container', value))
    .compose(throttle(100));

  const mouseDown$ = container$
    .events('mousedown')
    .map(ev => setState(ev, 'mouseIsDown', true));

  const mouseMove$ = container$
    .events('mousemove')
    .map(ev => updateAlpha(ev));

  // TODO: Send actions

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup')
    .map(ev => setState(event, 'mouseIsDown', false));

  const initialState = {
    a: 1,
    mouseIsDown: false,
    container: { width: 0, height: 0 }
  };

  const action$ = xs.merge(
    containerEl$,
    mouseDown$,
    mouseMove$,
    mouseUp$
  );

  const state$ = action$.fold((state, action) => action(state), initialState)

  return {
    DOM: xs.combine(state$, props$).map(view),
    alpha$: state$.compose(dropRepeats())
  };
}
