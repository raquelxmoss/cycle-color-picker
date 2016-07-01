import {Observable} from 'rx';

export default function mouse () {
  return {
    up () {
      return Observable.fromEvent(document, 'mouseup')
    }
  };
}
