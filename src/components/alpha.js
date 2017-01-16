import xs from 'xstream';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between } from '../helpers';
import { alphaStyle } from '../styles/alpha';
import intent from '../generators/intent';

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
  const { dimensions$, changeEvents$ } = intent({DOM, selector: '.alpha-container'});

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
