import {run} from '@cycle/core';
import {div, makeDOMDriver} from '@cycle/dom';
import {Observable} from 'rx';
import isolate from '@cycle/isolate';
import combineLatestObj from 'rx-combine-latest-obj';

import mouse from './src/drivers/mouse-driver';

var ColorPicker = require('./src/app').default;

const drivers = {
  DOM: makeDOMDriver('.app'),
  Mouse: mouse
};

function view ({colorPickerADOM, colorPickerBDOM, colorPickerAColor, colorPickerBColor}) {
  return (
    div('.app-container', [
      div('.left', {style: {background: colorPickerAColor}}, colorPickerADOM),
      div('.right', {style: {background: colorPickerBColor}}, colorPickerBDOM)
    ])
  );
}

function app (sources) {
  const propsA$ = Observable.of({color: '#47C3AC'});
  const propsB$ = Observable.of({color: '#542A93'});

  const ColorPickerA = isolate(ColorPicker);
  const colorPickerA = ColorPickerA({...sources, props$: propsA$});
  const ColorPickerB = isolate(ColorPicker);
  const colorPickerB = ColorPickerB({...sources, props$: propsB$});

  const state$ = combineLatestObj({
    colorPickerADOM: colorPickerA.DOM,
    colorPickerBDOM: colorPickerB.DOM,
    colorPickerAColor: colorPickerA.color$,
    colorPickerBColor: colorPickerB.color$
  });

  return {
    DOM: state$.map(view)
  };
}

const {sinks, sources} = run(app, drivers);
