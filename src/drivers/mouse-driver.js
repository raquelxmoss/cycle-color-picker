import fromEvent from 'xstream/extra/fromEvent';

export default function mouse () {
  return {
    up () {
      return fromEvent(document, 'mouseup');
    }
  };
}
