import {svg, h} from '@cycle/dom';

export default svg({
  attrs: {
    height: '25',
    width: '25',
    viewBox: '0 0 48 48'
  }
}, [
  h('path', {
    attrs: {
      d: 'M14.83 30.83l9.17-9.17 9.17 9.17 2.83-2.83-12-12-12 12z',
      fill: '#888'
    }
  }),
  h('path', {
    attrs: {
      d: 'M0 0h48v48h-48z',
      fill: 'none'
    }
  })
]);
