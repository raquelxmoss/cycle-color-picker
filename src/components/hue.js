import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { div } from '@cycle/dom';
import css from 'stylin';
import tinycolor from 'tinycolor2';

import { between, containerBoundaries, getContainerWidth } from '../helpers';
import { hueStyle } from '../styles/hue';

function view ([props, hue, dimensions]) {
  const hueIndicatorStyle = {
    left: `${dimensions.width * hue}px`
  };

  return (
    div(`.hue-container ${css.unimportant(hueStyle)}`, [
      div('.hue', [
        div('.hue-indicator', {style: hueIndicatorStyle})
      ])
    ])
  );
}

function calculateHue (event, dimensions) {
  const containerWidth = dimensions.width;
  const left = event.pageX - (dimensions.left + window.scrollX);

  const hue = between(0, containerWidth, left) / containerWidth;

  return hue;
}

function setHueFromProps (props) {
  return tinycolor.fromRatio(props).toHsv().h / 360;
}

export default function Hue ({DOM, color$}) {
  const container$ = DOM
    .select('.hue-container');

  const dimensions$ = container$
    .elements()
    .filter(elements => elements.length > 0)
    .map(el => el[0].getBoundingClientRect())
    .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    .startWith({width: 0, left: 0});

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

  const changeEvents$ = xs.merge(
    mouseDrag$,
    click$
  );

  const calculatedHue$ = dimensions$
    .map(dimensions => changeEvents$.map(event => calculateHue(event, dimensions)))
    .flatten();

  const hueFromProps$ = color$.map(setHueFromProps);

  const hue$ = xs.merge(
    hueFromProps$,
    calculatedHue$
  ).startWith(0);

  return {
    DOM: xs.combine(color$, hue$, dimensions$).map(view),
    change$: calculatedHue$.map(hue => ({h: hue}))
  };
}
