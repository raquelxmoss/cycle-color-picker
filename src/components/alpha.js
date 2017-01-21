import xs from 'xstream';
import { div } from '@cycle/dom';
import onionify from 'cycle-onionify';
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
  return function _calculateAlpha () {
    const containerWidth = dimensions.width;
    const left = event.pageX - (dimensions.left + window.scrollX);

    const alpha = between(0, containerWidth, left) / containerWidth;

    return alpha;
  };
}

function setAlphaFromProps (props) {
  return tinycolor.fromRatio(props).toHsv().a;
}

// hi, I am a reducer. I take in state and return state.

function Alpha ({DOM, onion, color$}) {
  const initialState$ = color$.map(setAlphaFromProps);
  const alpha$ = onion.state$;

  const { dimensions$, changeEvents$ } = intent({DOM, selector: '.alpha-container'});

  const calculatedAlpha$ = dimensions$
    .map(dimensions => changeEvents$.map(event => calculateAlpha(event, dimensions)))
    .flatten();

  const reducer$ = xs.merge(
    // initialState$,
    calculatedAlpha$
  );

  return {
    DOM: xs.combine(color$, alpha$, dimensions$).map(view),
    change$: calculatedAlpha$.map(alpha => ({a: alpha})),
    onion: reducer$
  };
}

export default onionify(Alpha);
