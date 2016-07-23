/* globals describe, it */
import ColorPicker from '../src/app';

import assert from 'assert';
import { Observable } from 'rx';
import { mockDOMSource } from '@cycle/dom';
import rxAdapter from '@cycle/rx-adapter';

describe('ColorPicker', () => {
  const Mouse = {
    up: () => Observable.empty()
  };
  const DOM = mockDOMSource(rxAdapter, {});

  it('takes a props$ of color and returns a color$', (done) => {
    const props$ = Observable.of({color: 'red'});
    const colorPicker = ColorPicker({Mouse, props$, DOM});

    colorPicker.color$.skip(1).take(1).subscribe((color) => {
      assert.equal(color, 'rgb(255, 0, 0)');
      done();
    });
  });

  it('returns an rgba when alpha is required', (done) => {
    const expectedColor = 'rgba(255, 255, 255, 0.5)';
    const props$ = Observable.of({color: expectedColor});

    const colorPicker = ColorPicker({DOM, Mouse, props$});

    colorPicker.color$.skip(1).take(1).subscribe((color) => {
      assert.equal(color, expectedColor);
      done();
    });
  });
});
