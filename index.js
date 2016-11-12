import {run} from '@cycle/xstream-run';
import {div, h1, h2, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import ColorPicker from './src/color-picker';

const drivers = {
  DOM: makeDOMDriver('.app')
};

function view (state) {
  return (
    div('.app-container', [
      div('.intro', [
        h1('.title', 'Cycle Color Picker'),
        h2('.intro-text', 'A color picker component for Cycle.js')
      ]),
      div([state])
    ])
  );
}

function app ({DOM}) {
  const props$ = xs.of({color: '#C3209F'});
  const colorPicker$ = ColorPicker({DOM, props$});
  const state$ = colorPicker$.DOM;

  return {
    DOM: state$.map(view)
  };
}

run(app, drivers);
