export const saturation = {
  'position': 'relative',
  'height': '127px',
  'width': '100%',
  'cursor': 'pointer',
  'overflow': 'hidden',
  'border-top-left-radius': '2px',
  'border-top-right-radius': '2px',
  '.white-overlay': {
    'width': '100%',
    'height': '100%',
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'background': 'linear-gradient(to right, #FFF, rgba(255, 255, 255, 0))',
    'z-index': '2'
  },
  '.grey-overlay': {
    'width': '100%',
    'height': '100%',
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'background': 'linear-gradient(to top, #000, rgba(0, 0, 0, 0))',
    'z-index': '3'
  },
  '.saturation-color': {
    'width': '100%',
    'height': '100%',
    'position': 'absolute',
    'top': '0',
    'left': '0',
    'z-index': '1'
  },
  '.saturation-indicator': {
    'position': 'absolute',
    'height': '10px',
    'width': '10px',
    'border-radius': '50%',
    'border': '1px solid black',
    'z-index': '5',
    'transform': 'translate(-5px, -5px)'
  }
};
