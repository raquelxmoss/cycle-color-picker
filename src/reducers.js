import {Observable} from 'rx';
import tinycolor from 'tinycolor2';

import {
  between,
  containerBoundaries,
  getColorFromHex,
  getColorFromRGBA,
  getColorFromHSLA
} from './helpers';

const update = {
  alpha: (event) => updateChannel(event, 'alpha', (x) => ({a: x})),
  hue: (event) => updateChannel(event, 'hue', (x) => ({h: x})),
  saturation: (event) => updateChannel(event, 'saturation', (x, y) => ({s: x, v: 1 - y}))
};

const updateColorFromInput = {
  hex: (state, channel, value) => getColorFromHex(value),
  rgba: (state, channel, value) => getColorFromRGBA(state, channel, value),
  hsla: (state, channel, value) => getColorFromHSLA(state, channel, value)
};

function updateChannel (event, type, updateFunction) {
  return function _updateChannel (state) {
    if (!state.activeInput.is(type)) { return state; }

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

function colorInputShouldChange (state, input) {
  return input === 'alpha' && state.colorInputFormat.value === 'hex';
}

function setActiveInputs (name) {
  return function _setActiveInputs (state) {
    const colorInputFormat = colorInputShouldChange(state, name) ? 'rgba' : state.colorInputFormat.value;

    return Object.assign(
      {},
      state,
      {
        activeInput: state.activeInput.set(name),
        colorInputFormat: state.colorInputFormat.set(colorInputFormat)
      }
    );
  };
}

function makeInputElementReducer$ (name, DOM) {
  const container = DOM
    .select(`.${name}`);

  const click$ = container
    .events('click');

  const mouseDown$ = container
    .events('mousedown');

  const activeInput$ = Observable.merge(
    mouseDown$,
    click$
  )
  .map(_ => setActiveInputs(name));

  const deactivateInput$ = click$
    .delay(200)
    .map(ev => state => Object.assign({}, state, {activeInput: state.activeInput.set('none')}));

  const mouseMove$ = container
    .events('mousemove');

  const update$ = Observable.merge(
    mouseMove$,
    click$
  )
  .map(ev => update[name](ev));

  const container$ = container
    .observable
    .skip(1)
    .map(el => el[0].getBoundingClientRect())
    .map(value => state => ({...state, [`${name}Container`]: value}))
    .sample(100);

  return Observable.merge(
    activeInput$,
    deactivateInput$,
    update$,
    container$
  );
}

function makeTextInputElementReducer$ (name, DOM) {
  return DOM
    .select(`.${name}-input`)
    .events('input')
    .debounce(300)
    .map(ev => ({value: ev.target.value, channel: ev.target.getAttribute('data-channel')}))
    .map(({channel, value}) => setStateFromInput({channel, value}));
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
    };
  };
}

function setStateFromInput ({channel, value}) {
  return function _setStateFromInput (state) {
    const newColor = updateColorFromInput[state.colorInputFormat.value](state, channel, value);
    const colorAsHex = tinycolor(newColor).toHexString();

    if (tinycolor(colorAsHex).isValid()) {
      const color = tinycolor(newColor).toHsv();
      color.h /= 360;

      return {
        ...state,

        color
      };
    }

    return state;
  };
}

function changeColorInputFormat (clickCount) {
  return function _changeColorInputFormat (state) {
    const inputFormats = ['rgba', 'hex', 'hsla'];
    const newFormat = inputFormats[clickCount % inputFormats.length];

    return Object.assign(
      {},
      state,
      {colorInputFormat: state.colorInputFormat.set(newFormat)}
    );
  };
}

export default function makeReducer$ ({DOM, Mouse, props$}) {
  const mouseUp$ = Mouse.up()
    .map(ev => state => ({...state, activeInput: state.activeInput.set('none')}));

  const setStateFromHexInput$ = DOM
    .select('.hex-input')
    .events('input')
    .debounce(300)
    .filter(ev => tinycolor(ev.target.value).isValid())
    .map(ev => setStateFromInput({value: ev.target.value}));

  const inputSwitcher$ = DOM
    .select('.switcher')
    .events('click')
    .map(ev => +1)
    .scan((total, curr) => total + curr);

  const changeColorInputFormat$ = inputSwitcher$
    .map(changeColorInputFormat);

  const setStateFromProps$ = props$
    .map(setStateFromProps);

  return Observable.merge(
    setStateFromProps$,
    setStateFromHexInput$,
    changeColorInputFormat$,

    mouseUp$,

    makeInputElementReducer$('saturation', DOM),
    makeInputElementReducer$('hue', DOM),
    makeInputElementReducer$('alpha', DOM),
    makeTextInputElementReducer$('hsla', DOM),
    makeTextInputElementReducer$('rgba', DOM)
  );
}
