import {Observable} from 'rx';
import {between, containerBoundaries} from './helpers';

function updateSaturation (event) {
  return function _updateSaturation(state) {
    return state.dragging.when({
      'saturation': () => {
        const {
          isInBounds,
          containerLeft,
          containerTop,
          containerWidth,
          containerHeight,
          top,
          left
        } = containerBoundaries(state, event, 'saturation');

        if (!isInBounds) { return state; }

        const saturation = left / containerWidth;
        const bright = 1 - (top / containerHeight);

        return {
          ...state,

          color: {
            ...state.color,

            s: saturation,
            v: bright
          }
        };
      },

      'default': () => state
    });
  };
}

function updateAlpha (event) {
  return function _updateAlpha(state) {
    return state.dragging.when({
      'alpha': () => {
        const {
          containerWidth,
          left
        } = containerBoundaries(state, event, 'alpha');

        const a = (between(0, containerWidth, left) * 100 / containerWidth) / 100;

        return {
          ...state,

          color: {
            ...state.color,

            a
          }
        }
      },

      'default': () => state
    });
  };
}

function updateHue (event) {
  return function _updateHue(state) {
    return state.dragging.when({
      'hue': () => {
        const {
          containerWidth,
          containerLeft,
          left
        } = containerBoundaries(state, event, 'hue');

        const isInBounds = left > 0 && left < containerWidth;

        if (!isInBounds) { return state; }

        const percent = left * 100 / containerWidth;
        const h = (360 * percent / 100);

        return {
          ...state,

          color: {
            ...state.color,

            h
          }
        }
      },

      'default': () => state
    });
  };
}

const update = {
  alpha: updateAlpha,
  hue: updateHue,
  saturation: updateSaturation
};

function makeInputElementReducer$ (name, DOM) {
  const container = DOM
    .select(`.${name}`);

  const containerMouseDown$ = container
    .events('mousedown')
    .map(ev => state => Object.assign({}, state, {dragging: state.dragging.set(name)}));

  const containerMouseMove$ = container
    .events('mousemove');

  const update$ = containerMouseMove$
    .map(ev => update[name](ev));

  const container$ = container
    .observable
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => ({...state, [`${name}Container`]: value}))
    .take(1);

  return Observable.merge(
    containerMouseDown$,
    update$,
    container$
  );
}

export default function makeReducer$ ({DOM, Mouse}) {
  const mouseUp$ = Mouse.up()
    .map(ev => state => ({...state, dragging: state.dragging.set('none')}));

  return Observable.merge(
    mouseUp$,
    makeInputElementReducer$('saturation', DOM),
    makeInputElementReducer$('hue', DOM),
    makeInputElementReducer$('alpha', DOM)
  );
}
