import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';

export default function intent ({DOM, selector}) {
  const container$ = DOM
    .select(selector);

  const dimensions$ = container$
    .elements()
    .filter(elements => elements.length > 0)
    .map(el => el[0].getBoundingClientRect())
    .compose(dropRepeats((a, b) => JSON.stringify(a) === JSON.stringify(b)))
    .startWith({width: 0, left: 0});

  const mouseMove$ = DOM
    .select('document')
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

  return {
    dimensions$,
    changeEvents$
  };
}
