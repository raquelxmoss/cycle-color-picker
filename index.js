import {run} from '@cycle/xstream-run';
import {div, h1, h2, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import isolate from '@cycle/isolate';
import combineObj from 'xs-combine-obj';
import ColorPicker from './src/color-picker';

import SaturationValue from './src/components/saturation-value';

const drivers = {
  DOM: makeDOMDriver('.app')
};

function view (state) {
  console.log(state)
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

function app ({DOM}) {
  const color$ = xs.of('#C3209F');
  // const propsB$ = xs.of({color: '#542A93'});

//   const ColorPickerA = isolate(ColorPicker);
//   const colorPickerA = ColorPickerA({...sources, props$: propsA$});
//   const ColorPickerB = isolate(ColorPicker);
  // const colorPickerB = ColorPickerB({...sources, props$: propsB$});

  // const state$ = combineObj({
  //   colorPickerADOM: colorPickerA.DOM,
  //   colorPickerBDOM: colorPickerB.DOM,
  //   colorPickerAColor: colorPickerA.color$,
  //   colorPickerBColor: colorPickerB.color$
  // });

  const saturationValue = SaturationValue({DOM, color$})

  const state$ = saturationValue.onion.debug()

  return {
    DOM: saturationValue.DOM.map(view)
  };
}

run(app, drivers);
