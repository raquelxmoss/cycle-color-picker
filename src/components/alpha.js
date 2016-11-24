import xs from 'xstream';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between, containerBoundaries, getContainerWidth } from '../helpers';
import { alphaStyle } from '../styles/alpha';

function view ([props, alpha]) {
  console.log(props, alpha)
  const container = getContainerWidth('.alpha-container');

  const alphaIndicatorStyle = {
    left: `${container.width * alpha}px`
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

function calculateAlpha (event) {
  const container = getContainerWidth('.alpha-container');
  const { containerWidth, left } = containerBoundaries('', event, container);
  const alpha = between(0, containerWidth, left) / containerWidth;

  return alpha;
}

function setAlphaFromProps (props) {
  return tinycolor.fromRatio(props).toHsv().a;
}

export default function Alpha ({DOM, color$}) {
  const container$ = DOM
    .select('.alpha-container');

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

  const update$ = xs.merge(
    mouseDrag$,
    click$
  ).map(calculateAlpha);

  const alphaFromProps$ = color$.map(setAlphaFromProps);

  const alpha$ = xs.merge(
    alphaFromProps$,
    update$
  ).startWith(0);

  return {
    DOM: xs.combine(color$, alpha$).map(view),
    change$: update$.map(alpha => ({a: alpha}))
  };
}
