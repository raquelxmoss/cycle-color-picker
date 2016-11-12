import xs from 'xstream';
import { div } from '@cycle/dom';
import css from 'stylin';
import tinycolor from 'tinycolor2';

import { between, containerBoundaries, getContainerWidth } from '../helpers';
import { hueStyle } from '../styles/hue';

function view (hue) {
  const container = getContainerWidth('.hue-container');

  const hueIndicatorStyle = {
    left: `${container.width * hue}px`
  };

  return (
    div(`.hue-container ${css.unimportant(hueStyle)}`, [
      div('.hue', [
        div('.hue-indicator', {style: hueIndicatorStyle})
      ])
    ])
  );
}

function calculateHue (event) {
  const container = getContainerWidth('.hue-container');

  const { containerWidth, left } = containerBoundaries('', event, container);

  const hue = between(0, containerWidth, left) / containerWidth;

  return hue;
}

function setHueFromProps (props) {
  return tinycolor(props).toHsv().h / 360;
}

export default function Hue ({DOM, color$}) {
  const container$ = DOM
    .select('.hue-container');

  const mouseMove$ = container$
    .events('mousemove');

  const mouseDown$ = container$
    .events('mousedown');

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup');

  const click$ = container$
    .events('click');

  const mouseDrag$ = mouseDown$
    .map(down => mouseMove$.endWhen(mouseUp$))
    .flatten();

  const change$ = xs.merge(
    mouseDrag$,
    click$
  ).map(calculateHue);

  const hueFromProps$ = color$
    .map(setHueFromProps);

  const hue$ = xs.merge(
    change$,
    hueFromProps$
  ).startWith(0);

  return {
    DOM: hue$.map(view),
    hue$
  };
}
