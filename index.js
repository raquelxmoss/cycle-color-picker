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
      state
    ])
  );
}

function app ({DOM}) {
  const props$ = xs.of({color: '#C3209F'});
  const colorPicker = ColorPicker({DOM, props$});
  // const color$ = colorPicker$.color$;

  const state$ = colorPicker.DOM;

  return {
    DOM: state$.map(view)
  };
}

run(app, drivers);
