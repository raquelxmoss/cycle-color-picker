import xs from 'xstream';

export function sample (interval) {
  return function sampleOperator (stream) {
    const periodic$ = xs.periodic(interval);

    return stream
      .map(event => periodic$.mapTo(event))
      .flatten();
  };
}
