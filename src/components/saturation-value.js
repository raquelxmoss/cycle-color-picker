import xs from 'xstream';
import { div } from '@cycle/dom';
import tinycolor from 'tinycolor2';
import css from 'stylin';

import { between, containerBoundaries, getContainerWidth } from '../helpers';
import { saturationValueStyle } from '../styles/saturation-value';

function view ([props, { saturation, value }]) {
  const container = getContainerWidth('.saturation-value-container');

  const propsColor = tinycolor.fromRatio(props.color).toHsv();

  const background = `hsl(${propsColor.h}, 100%, 50%)`;
  const indicatorColor = value < 0.5 ? '#fff' : '#000';

  const indicatorStyle = {
    left: `${container.width * saturation}px`,
    top: `${container.height * (1 - value)}px`,
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

function calculateSaturationValue (event) {
  const container = getContainerWidth('.saturation-value-container');

  const {
    containerWidth,
    containerHeight,
    top,
    left
  } = containerBoundaries('', event, container);

  const saturation = between(0, containerWidth, left) / containerWidth;
  const value = 1 - (between(0, containerHeight, top) / containerHeight);

  return { saturation, value };
}

function setSaturationValueFromProps (props) {
  if ('color' in props) {
    const color = tinycolor(props.color).toHsv();

    return { saturation: color.s, value: color.v };
  }
}

export default function SaturationValue ({DOM, props$}) {
  const container$ = DOM
    .select('.saturation-value-container');

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
  ).map(calculateSaturationValue);

  const saturationValueFromProps$ = props$
    .map(setSaturationValueFromProps);

  const saturationValue$ = xs.merge(
    change$,
    saturationValueFromProps$
  ).startWith(0);

  return {
    DOM: xs.combine(props$, saturationValue$).map(view),
    saturationValue$
  };
}
