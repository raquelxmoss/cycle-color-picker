import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between } from '../helpers';
import { alphaStyle } from '../styles/alpha';

function view ([props, alpha, dimensions]) {
  const alphaIndicatorStyle = {
    left: `${dimensions.width * alpha}px`
  };

  const color = tinycolor.fromRatio(props);
  const gradientStart = color.clone().setAlpha(0);

  const gradientStyle = {
    background: `linear-gradient(to right, ${tinycolor(gradientStart).toRgbString()}  0%, ${color.toHexString()} 100%)`
  };

  return (
    div(`.alpha-container ${css.unimportant(alphaStyle)}`, [
      div('.alpha', [
        div('.checkerboard'),
        div('.gradient-overlay', {style: gradientStyle}),
        div('.alpha-indicator', {style: alphaIndicatorStyle})
      ])
    ])
  );
}

function calculateAlpha (event, dimensions) {
  const containerWidth = dimensions.width;
  const left = event.pageX - (dimensions.left + window.scrollX);

  const alpha = between(0, containerWidth, left) / containerWidth;

  return alpha;
}

function setAlphaFromProps (props) {
  return tinycolor.fromRatio(props).toHsv().a;
}

export default function Alpha ({DOM, color$}) {
  const container$ = DOM
    .select('.alpha-container');

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

  const calculatedAlpha$ = dimensions$
    .map(dimensions => changeEvents$.map(event => calculateAlpha(event, dimensions)))
    .flatten();

  const alphaFromProps$ = color$.map(setAlphaFromProps);

  const alpha$ = xs.merge(
    alphaFromProps$,
    calculatedAlpha$
  ).startWith(0);

  return {
    DOM: xs.combine(color$, alpha$, dimensions$).map(view),
    change$: calculatedAlpha$.map(alpha => ({a: alpha}))
  };
}
