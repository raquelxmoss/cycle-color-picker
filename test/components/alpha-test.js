/* globals it, describe */
import { mockTimeSource } from '@cycle/time';
import { mockDOMSource } from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';
import xs from 'xstream';

import Alpha from '../../src/components/alpha';

global.window = { scrollX: 0 };

describe('alpha', () => {
  it('calculates alpha based on mouse coordinates', (done) => {
    const Time = mockTimeSource();

    const click$    = Time.diagram('--X---Y|', {
      X: {pageX: 20},
      Y: {pageX: 30}
    });

    const expected$ = Time.diagram('--X---Y|', {
      X: 0.2,
      Y: 0.3
    });

    const elements$ = xs.of([{
      getBoundingClientRect () {
        return { width: 100, left: 0 };
      }
    }]);

    const DOM = mockDOMSource(xstreamAdapter, {
      '.alpha-container': {
        click: click$,
        elements: elements$
      }
    });

    const color$ = xs.of('#fff');

    const alpha = Alpha({DOM, color$});

    Time.assertEqual(alpha.change$.map(change => change.a), expected$);

    Time.run(done);
  });
});
