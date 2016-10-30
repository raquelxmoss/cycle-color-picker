import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { div } from '@cycle/dom';
import { between, containerBoundaries } from '../helpers';
import { sample } from '../operators';
import tinycolor from 'tinycolor2';
import { alphaStyle } from '../styles/alpha';
import css from 'stylin';

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
    div(`.alpha-container ${css.unimportant(alphaStyle)}`, [
      div('.alpha', [
        div('.checkerboard'),
        div('.gradient-overlay', {style: gradientStyle}),
        div('.alpha-indicator', {style: alphaIndicatorStyle})
      ])
    ])
  );
}

function updateAlpha (event) {
  return function _updateAlpha (state) {
    if (!state.mouseIsDown) { return state; }

    const { containerWidth, left } = containerBoundaries(state, event, state.container);
    const alpha = between(0, containerWidth, left) / containerWidth;

    return Object.assign({}, state, {alpha});
  };
}

function setState (event, type, value) {
  return function _setState (state) {
    return {...state, [`${type}`]: value};
  };
}

function setStateFromProps (props) {
  return function _setStateFromProps (state) {
    if ('color' in props) {
      props.color = tinycolor(props.color).toHsv();
      // props.color.h /= 360;
    }

    return {
      ...state,

      ...props
    };
  };
}

export default function Alpha ({DOM, props$}) {
  const container$ = DOM
    .select('.alpha-container');

  const containerEl$ = container$
    .elements()
    .drop(1)
    .compose(sample(100))
    .map(el => el[0].getBoundingClientRect())
    .map(value => setState('nil', 'container', value));

  const mouseDown$ = container$
    .events('mousedown')
    .map(ev => setState(ev, 'mouseIsDown', true));

  const mouseMove$ = container$
    .events('mousemove');

  const click$ = container$
    .events('click');

  const update$ = xs.merge(click$, mouseMove$)
    .map(ev => updateAlpha(ev));

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup')
    .map(ev => setState(ev, 'mouseIsDown', false));

  const stateFromProps$ = props$.map(setStateFromProps);

  const initialState = {
    alpha: 1,
    mouseIsDown: false,
    container: { width: 0, height: 0 }
  };

  const action$ = xs.merge(
    containerEl$,
    mouseDown$,
    mouseUp$,
    update$,
    stateFromProps$
  );

  const state$ = action$.fold((state, action) => action(state), initialState);
  const alpha$ = state$.map(state => state.alpha);

  return {
    DOM: xs.combine(state$, props$).map(view),
    alpha$
  };
}
