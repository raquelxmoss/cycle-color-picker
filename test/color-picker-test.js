/* globals describe, it */
import ColorPicker from '../src/color-picker';

import assert from 'assert';
import xs from 'xstream';
import { mockDOMSource } from '@cycle/dom';
import xsAdapter from '@cycle/xstream-adapter';

describe('ColorPicker', () => {
  const Mouse = {
    up: () => xs.empty()
  };
  const DOM = mockDOMSource(xsAdapter, {});

  it('takes a props$ of color and returns a color$', (done) => {
    const props$ = xs.of({color: 'red'});
    const colorPicker = ColorPicker({Mouse, props$, DOM});

    colorPicker.color$.drop(1).take(1).addListener({
      next: (color) => {
        assert.equal(color, 'rgb(255, 0, 0)');
      },
      error: done,
      complete: done
    });
  });

  it('returns an rgba when alpha is required', (done) => {
    const expectedColor = 'rgba(255, 255, 255, 0.5)';
    const props$ = xs.of({color: expectedColor});

    const colorPicker = ColorPicker({DOM, Mouse, props$});

    colorPicker.color$.drop(1).take(1).addListener({
      next: (color) => {
        assert.equal(color, expectedColor);
      },
      error: done,
      complete: done
    });
  });
});
