export const hueStyle = {
  'position': 'relative',
  'height': '10px',
  'margin-bottom': '10px',
  '.hue': {
    'background': 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
    'height': '10px',
    'width': '100%',
    'position': 'absolute',
    'cursor': 'pointer',
    'border-radius': '2px'
  },
  '.hue-indicator': {
    'position': 'absolute',
    'width': '10px',
    'height': '10px',
    'background': 'white',
    'border-radius': '50%',
    'box-shadow': 'rgba(0, 0, 0, 0.368627) 0px 1px 4px 0px',
    'transform': 'translateX(-5px)'
  }
};
