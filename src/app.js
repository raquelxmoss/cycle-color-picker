import {input, div, button, p} from '@cycle/dom'
import {Observable} from 'rx';

export default function App ({DOM, Keys}) {
  const color$ = DOM
    .select('.color-picker')
    .events('mouseover')

  const action$ = Observable.merge(
  );

  const state$ = action$
    .startWith(initialState)
    .scan((state, action) => action(state));

  return {
    DOM: state$.map(state =>
      div('.container', [
          div('.color-picker', [
            div('.color-overlay'),
            div('.color'),
            div('.black'),
            div('.indicator')
          ]),
        ])
       ),
  }
}
