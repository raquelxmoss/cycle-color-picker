/* globals describe, it */
import ColorPicker from '../src/app';

import assert from 'assert';
import { Observable } from 'rx';
import { mockDOMSource } from '@cycle/dom';
import rxAdapter from '@cycle/rx-adapter';

describe('ColorPicker', () => {
  it('takes a props$ of color and returns a color$', (done) => {
    const props$ = Observable.of({color: '#fff'});

    const Mouse = {
      up: () => Observable.empty()
    };

    const DOM = mockDOMSource(rxAdapter, {});

    const colorPicker = ColorPicker({Mouse, props$, DOM});

    colorPicker.color$.take(1).subscribe((color) => {
      assert.equal(color, 'rgb(255, 255, 255)');
      done();
    });
  });
});
