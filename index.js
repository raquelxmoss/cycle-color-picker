import {run} from '@cycle/xstream-run';
import {div, h1, h2, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import isolate from '@cycle/isolate';
import Alpha from './src/components/alpha';

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
      div('.pickers', [
        div('.left', [state])
      ])
    ])
  );
}

function app (sources) {
  const props$ = xs.of({color: '#C3209F'});
  const alpha = Alpha({...sources, props$});
  const state$ = alpha.DOM;

  return {
    DOM: state$.map(view)
  };
}

run(app, drivers);
