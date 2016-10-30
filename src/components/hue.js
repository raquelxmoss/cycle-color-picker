import xs from 'xstream';
import { div } from '@cycle/dom';
import dropRepeats from 'xstream/extra/dropRepeats';
import { sample } from '../operators';
import { between, containerBoundaries } from '../helpers';
import { hueStyle } from '../styles/hue';
import tinycolor from 'tinycolor2';
import css from 'stylin';

function updateHue (event) {
  return function _updateHue (state) {
    if (!state.mouseIsDown) { return state; }

    const { containerWidth, left } = containerBoundaries(state, event, state.container);
    const hue = between(0, containerWidth, left) / containerWidth;
    console.log(hue)

    return Object.assign({}, state, {hue});
  };
}

function setState (event, type, value) {
  return function _setState (state) {
    return {...state, [`${type}`]: value};
  };
}

function view ([state, props]) {
  const hueIndicatorStyle = {
    left: `${state.container.width * state.hue}px`
  };

  return (
    div(`.hue-container ${css.unimportant(hueStyle)}`, [
      div('.hue', [
        div('.hue-indicator', {style: hueIndicatorStyle})
      ])
    ])
  );
}

export default function Hue ({DOM, props$}) {
  const container$ = DOM
    .select('.hue-container');

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
    .map(ev => updateHue(ev));

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup')
    .map(ev => setState(ev, 'mouseIsDown', false));

  const initialState = {
    hue: 0,
    mouseIsDown: false,
    container: { width: 0, height: 0 }
  };

  const actions$ = xs.merge(
    containerEl$,
    mouseDown$,
    mouseUp$,
    update$
  );

  const state$ = actions$.fold((state, action) => action(state), initialState);

  return {
    DOM: xs.combine(state$, props$).map(view),
    hue$: state$.compose(dropRepeats((state) => JSON.stringify(state) === JSON.stringify(state)))
  };
}
