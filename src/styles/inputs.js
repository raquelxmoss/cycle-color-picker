export const inputs = {
  'display': 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'height': '55px',
  'padding': '0 15px 10px',
  'text-transform': 'uppercase',
  'color': '#888',
  'font-size': '0.7em',
  'font-family': 'Helvetica, sans-serif',
  '.color-display': {
    'display': 'flex',
    'width': '90%'
  },
  '.color-input-container': {
    display: 'flex'
  },
  '.channel-container': {
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'flex-direction': 'column'
  },
  '.color-input': {
    'margin-bottom': '2px',
    'padding': '2px',
    'width': '70%',
    'height': '20px',
    'border': 'none',
    'text-align': 'center'
  },
  '.hex-input': {
    'width': '100%',
    'margin': '0 20px',
    'border': 'none',
    'padding': '8px',
    'text-align': 'center',
    'text-transform': 'uppercase'
  },
  '.input-switcher': {
    'cursor': 'pointer',
    'color': '#888',
    'margin': '2px 0',
    '.up': {
      'height': '20px',
      'width': '20px',
      'background': 'url("/src/icons/arrow-up.svg")',
      'background-size': '20px',
      'margin': '0'
    },
    '.down': {
      'height': '20px',
      'width': '20px',
      'background': 'url("/src/icons/arrow-down.svg")',
      'background-size': '20px',
      'margin': '0'
    }
  }
};
