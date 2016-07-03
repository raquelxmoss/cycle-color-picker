import {run} from '@cycle/core';
import {div, makeDOMDriver} from '@cycle/dom';
import {restart, restartable} from 'cycle-restart';
import {Observable} from 'rx';

import mouse from './src/drivers/mouse-driver';
var ColorPicker = require('./src/app').default;

const drivers = {
  DOM: makeDOMDriver('.app'),
  Mouse: mouse
};

function app (sources) {
  const props$ = Observable.of({color: 'magenta'});
  const colorPicker = ColorPicker({...sources, props$});

  return {
    DOM: colorPicker.color$.map(color =>
      div('.app-container', {style: {background: color}}, [
        colorPicker.DOM
      ])
    )
  };
}

const {sinks, sources} = run(app, drivers);

