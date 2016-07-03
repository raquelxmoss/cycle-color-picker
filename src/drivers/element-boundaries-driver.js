import xs from 'xstream';

export default function elementBoundaries () {
  return {
    rect (el) {
      const element = document.querySelector(el);

      if (!element) { return xs.empty(); }

      return xs.of(element[0].getBoundingClientRect());
    }
  };
}
