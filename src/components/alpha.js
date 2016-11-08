import xs from 'xstream';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between, containerBoundaries } from '../helpers';
import { alphaStyle } from '../styles/alpha';

function getContainerWidth (selector) {
  const container = document.querySelector(selector);

  if (container) {
    return container.getBoundingClientRect();
  }

  return {width: 0, height: 0};
}

function view ([props, alpha]) {
  const container = getContainerWidth('.alpha-container');

  const alphaIndicatorStyle = {
    left: `${container.width * alpha}px`
  };

  const color = tinycolor.fromRatio(props.color);
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
  const container = document.querySelector('.alpha-container').getBoundingClientRect();

  const { containerWidth, left } = containerBoundaries('', event, container);
  const alpha = between(0, containerWidth, left) / containerWidth;

  return alpha;
}

function setAlphaFromProps (props) {
  if ('color' in props) {
    const color = tinycolor(props.color).toHsv();
    return color.a;
  }
}

export default function Alpha ({DOM, props$}) {
  const container$ = DOM
    .select('.alpha-container');

  const mouseMove$ = container$
    .events('mousemove');

  const mouseDown$ = container$
    .events('mousedown');

  const mouseUp$ = DOM
    .select('document')
    .events('mouseup');

  const change$ = mouseDown$
    .map(down => mouseMove$.endWhen(mouseUp$).map(calculateAlpha))
    .flatten();

  const alphaFromProps$ = props$
    .map(setAlphaFromProps);

  const alpha$ = xs.merge(
    change$,
    alphaFromProps$
  )
  .startWith(100);

  return {
    DOM: xs.combine(props$, alpha$).map(view),
    alpha$
  };
}
