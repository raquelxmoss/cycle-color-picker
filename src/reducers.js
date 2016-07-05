import {Observable} from 'rx';
import {between, containerBoundaries} from './helpers';
import tinycolor from 'tinycolor2';

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

const update = {
  alpha: (event) => updateChannel(event, 'alpha', (x) => ({a: x})),
  hue: (event) => updateChannel(event, 'hue', (x) => ({h: x})),
  saturation: (event) => updateChannel(event, 'saturation', (x, y) => ({s: x, v: 1 - y}))
};

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
  .map(ev => state => Object.assign({}, state, {activeInput: state.activeInput.set(name)}));

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

function setStateFromRGBAInput ({channel, value}) {
  return function _setStateFromRGBAInput (state) {
    const color = tinycolor.fromRatio(state.color).toRgb();
    color[channel] = value;

    const colorAsHex = tinycolor(color).toHexString();

    if (tinycolor(colorAsHex).isValid()) {
      const newColor = tinycolor(color).toHsv();
      newColor.h /= 360;

      return {
        ...state,

        color: newColor
      };
    }

    return state;
  };
}

function changeColorInputFormat () {
  return function _changeColorInputFormat (state) {
    const inputFormats = ['rgba', 'hex'];
    const currentFormat = state.colorInputFormat.value;

    const newFormat = inputFormats.find(format => format !== currentFormat);
    console.log(newFormat);

    return Object.assign({}, state, {colorInputFormat: state.colorInputFormat.set(newFormat)});
  };
}

export default function makeReducer$ ({DOM, Mouse, props$}) {
  const mouseUp$ = Mouse.up()
    .map(ev => state => ({...state, dragging: state.activeInput.set('none')}));

  const setStateFromHexInput$ = DOM
    .select('.hex-input')
    .events('input')
    .debounce(300)
    .filter(ev => tinycolor(ev.target.value).isValid())
    .map(ev => setStateFromProps({color: ev.target.value}));

  const setStateFromRGBAInput$ = DOM
    .select('.rgba-input')
    .events('input')
    .debounce(300)
    .map(ev => ({value: ev.target.value, channel: ev.target.getAttribute('data-channel')}))
    .map(({channel, value}) => setStateFromRGBAInput({channel, value}));

  const inputSwitcher$ = DOM
    .select('.switcher')
    .events('click');

  const changeColorInputFormat$ = inputSwitcher$
    .map(changeColorInputFormat);

  const setStateFromProps$ = props$
    .map(setStateFromProps);

  return Observable.merge(
    setStateFromProps$,
    setStateFromHexInput$,
    setStateFromRGBAInput$,
    changeColorInputFormat$,

    mouseUp$,

    makeInputElementReducer$('saturation', DOM),
    makeInputElementReducer$('hue', DOM),
    makeInputElementReducer$('alpha', DOM)
  );
}
