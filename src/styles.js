export const colorDisplay = {
  'display': 'flex',
  'width': '90%'
};

export const colorInputContainer = {
  'display': 'flex'
};

export const channelContainer = {
  'display': 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'flex-direction': 'column'
};

export const colorInput = {
  'margin-bottom': '2px',
  'padding': '2px',
  'width': '70%',
  'height': '20px',
  'border': 'none',
  'text-align': 'center'
};

export const inputsContainer = {
  'display': 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'padding': '0 15px 10px',
  'text-transform': 'uppercase',
  'color': '#888',
  'font-size': '0.7em',
  'font-family': 'Helvetica, sans-serif'
};

export const hexInput = {
  'width': '100%',
  'margin': '0 20px',
  'border': 'none',
  'padding': '8px',
  'text-align': 'center',
  'text-transform': 'uppercase'
};

export const controlsContainer = {
  'display': 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'padding': '10px 15px',
  'height': '40px'
};

export const saturation = {
  'position': 'relative',
  'height': '127px',
  'width': '100%',
  'cursor': 'pointer',
  'overflow': 'hidden',
  'border-top-left-radius': '2px',
  'border-top-right-radius': '2px'
};

export const whiteOverlay = {
  'width': '100%',
  'height': '100%',
  'position': 'absolute',
  'top': '0',
  'left': '0',
  'background': 'linear-gradient(to right, #FFF, rgba(255, 255, 255, 0))',
  'z-index': '2'
};

export const greyOverlay = {
  'width': '100%',
  'height': '100%',
  'position': 'absolute',
  'top': '0',
  'left': '0',
  'background': 'linear-gradient(to top, #000, rgba(0, 0, 0, 0))',
  'z-index': '3'
};

export const saturationColor = {
  'width': '100%',
  'height': '100%',
  'position': 'absolute',
  'top': '0',
  'left': '0',
  'z-index': '1'
};

export const saturationIndicator = {
  'position': 'absolute',
  'height': '10px',
  'width': '10px',
  'border-radius': '50%',
  'border': '1px solid black',
  'z-index': '5',
  'transform': 'translate(-5px, -5px)'
};

export const sliders = {
  'display': 'flex',
  'flex-direction': 'column',
  'justify-content': 'space-around',
  'margin-left': '10px',
  'width': '100%',
  'height': '100%'
};

export const hueContainer = {
  'position': 'relative',
  'height': '10px',
  'margin-bottom': '10px'
};

export const alphaContainer = {
  'position': 'relative',
  'height': '10px'
};

export const hueStyle = {
  'background': 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
  'height': '10px',
  'width': '100%',
  'position': 'absolute',
  'cursor': 'pointer',
  'border-radius': '2px'
};

export const sliderIndicator = {
  'position': 'absolute',
  'width': '10px',
  'height': '10px',
  'background': 'white',
  'border-radius': '50%',
  'box-shadow': 'rgba(0, 0, 0, 0.368627) 0px 1px 4px 0px',
  'transform': 'translateX(-5px)'
};

export const alphaStyle = {
  'height': '10px',
  'width': '100%',
  'cursor': 'pointer',
  'border-radius': '2px',
  '.gradient-overlay': {
    'width': '100%',
    'height': '100%',
    'position': 'absolute',
    'border-radius': '2px'
  },
  '.checkerboard': {
    'position': 'absolute',
    '-webkit-box-sizing': 'content-box',
    '-moz-box-sizing': 'content-box',
    'box-sizing': 'content-box',
    'width': '100%',
    'height': '10px',
    'border-radius': '2px',
    'background': 'linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), rgb(255, 255, 255)',
    'background-position': '0 0, 5px 5px',
    '-webkit-background-origin': 'padding-box',
    'background-origin': 'padding-box',
    '-webkit-background-clip': 'border-box',
    'background-clip': 'border-box',
    '-webkit-background-size': '10px 10px',
    'background-size': '10px 10px'
  }
};

export const swatchStyle = {
  '.swatch-color': {
    'width': '20px',
    'height': '20px',
    'border-radius': '50%'
  },
  '.swatch-underlay': {
    'border-radius': '50%',
    'background': 'linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), linear-gradient(45deg, rgba(0,0,0,0.0980392) 25%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.0980392) 75%, rgba(0,0,0,0.0980392) 0), rgb(255, 255, 255)',
    'background-position': '0 0, 5px 5px',
    '-webkit-background-origin': 'padding-box',
    'background-origin': 'padding-box',
    '-webkit-background-clip': 'border-box',
    'background-clip': 'border-box',
    '-webkit-background-size': '10px 10px',
    'background-size': '10px 10px'
  }
};

export const switcherStyle = {
  'cursor': 'pointer',
  'color': '#888',
  'margin': '2px 0',
  '.up': {
    'height': '20px',
    'width': '20px',
    'background': 'url("/src/icons/arrow-up.svg")',
    'background-size': '20px'
  },
  '.down': {
    'height': '20px',
    'width': '20px',
    'background': 'url("/src/icons/arrow-down.svg")',
    'background-size': '20px'
  }
};
// var css = require('stylin')
// var h = require('virtual-dom/h')

// function render (color) {
//   var style = {
//     color: color,
//     '&:hover': {
//       backgroundColor: color
//     }
//   }
//   return h('div', {className: css(style)})
// }
