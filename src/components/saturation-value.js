import xs from 'xstream';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between } from '../helpers';
import { saturationValueStyle } from '../styles/saturation-value';
import intent from '../generators/intent';

function view ([props, { s, v }, dimensions]) {
  const propsColor = tinycolor.fromRatio(props).toHsv();

  const background = `hsl(${propsColor.h}, 100%, 50%)`;
  const indicatorColor = v < 0.5 ? '#ffffff' : '#000000';

  const indicatorStyle = {
    left: `${dimensions.width * s}px`,
    top: `${dimensions.height * (1 - v)}px`,
    'border-color': `${indicatorColor}`
  };

  return (
    div(`.saturation-value-container ${css.unimportant(saturationValueStyle)}`, [
      div('.white-overlay'),
      div('.saturation-color', {style: {background}}),
      div('.grey-overlay'),
      div('.saturation-indicator', {style: indicatorStyle})
    ])
  );
}

function calculateSaturationValue (event, dimensions) {
  const containerWidth = dimensions.width;
  const containerHeight = dimensions.height;
  const left = event.pageX - (dimensions.left + window.scrollX);
  const top = event.pageY - (dimensions.top + window.scrollY);

  const s = between(0, containerWidth, left) / containerWidth;
  const v = 1 - between(0, containerHeight, top) / containerHeight;

  return { s, v };
}

function setSaturationValueFromProps (props) {
  const color = tinycolor.fromRatio(props).toHsv();

  return { s: color.s, v: color.v };
}

export default function SaturationValue ({DOM, color$}) {
  const { dimensions$, changeEvents$ } = intent({DOM, selector: '.saturation-value-container'});

  const update$ = dimensions$
    .map(dimensions => changeEvents$.map(event => calculateSaturationValue(event, dimensions)))
    .flatten();

  const saturationValueFromProps$ = color$
    .map(setSaturationValueFromProps);

  const saturationValue$ = xs.merge(
    update$,
    saturationValueFromProps$
  ).startWith({s: 0, v: 0});

  return {
    DOM: xs.combine(color$, saturationValue$, dimensions$).map(view),
    change$: update$
  };
}
