import {Observable} from 'rx';
import {between, containerBoundaries} from './helpers';
import tinycolor from 'tinycolor2';

function updateChannel (event, type, updateFunction) {
  return function _updateChannel (state) {
    if (!state.dragging.is(type)) { return state; }

    const {
      containerWidth,
      containerHeight,
      top,
      left
    } = containerBoundaries(state, event, type);

    const xRatio = between(0, containerWidth, left) / containerWidth;
    const yRatio = between(0, containerHeight, top) / containerHeight;

    return {
      ...state,

      color: {
        ...state.color,

        ...updateFunction(xRatio, yRatio)
      }
    };
  };
}

const update = {
  alpha: (event) => updateChannel(event, 'alpha', (x) => ({a: x})),
  hue: (event) => updateChannel(event, 'hue', (x) => ({h: x})),
  saturation: (event) => updateChannel(event, 'saturation', (x, y) => ({s: x, v: 1 - y}))
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
    .skip(1)
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => ({...state, [`${name}Container`]: value}))
    .sample(100);

  return Observable.merge(
    containerMouseDown$,
    update$,
    container$
  );
}

function setStateFromProps (props) {
  return function _setStateFromProps (state) {
    if ('color' in props) {
      props.color = tinycolor(props.color).toHsv();
      props.color.h /= 360;
    }

    return {
      ...state,

      ...props
    }
  }
}

export default function makeReducer$ ({DOM, Mouse, props$}) {
  const mouseUp$ = Mouse.up()
    .map(ev => state => ({...state, dragging: state.dragging.set('none')}));

  const setStateFromProps$ = props$
    .map(setStateFromProps);

  return Observable.merge(
    setStateFromProps$,

    mouseUp$,
    makeInputElementReducer$('saturation', DOM),
    makeInputElementReducer$('hue', DOM),
    makeInputElementReducer$('alpha', DOM)
  );
}
