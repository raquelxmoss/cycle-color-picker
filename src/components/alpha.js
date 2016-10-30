import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import { div } from '@cycle/dom';
import { between, containerBoundaries } from '../helpers';
import { sample } from '../operators';
import tinycolor from 'tinycolor2';
import { alphaStyle } from '../styles/alpha';
import css from 'stylin';

function view ([props, alpha, container]) {
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

function calculateAlpha ([event, container]) {
  const { containerWidth, left } = containerBoundaries('', event, container);
  const alpha = between(0, containerWidth, left) / containerWidth;

  return alpha;
}

export default function Alpha ({DOM, props$}) {
  const container$ = DOM
    .select('.alpha-container');

  const containerEl$ = container$
    .elements()
    .drop(1)
    .compose(sample(500))
    .map(el => el[0].getBoundingClientRect());

  const mouseMove$ = container$
    .events('mousemove');

  const alpha$ = xs.combine(mouseMove$, containerEl$)
    .addListener({next: (ev) => calculateAlpha(ev)});
    // .dropRepeats()

  return {
    DOM: xs.combine(props$, alpha$, containerEl$).map(view),
    alpha$
  };
}
