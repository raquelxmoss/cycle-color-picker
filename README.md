# Cycle Color Picker

A color picker component for Cycle.js. Cycle Color Picker is developed for usage within [Cycle](http://cycle.js.org/) applications using [xstream](https://github.com/staltz/xstream).

![Color Picker in Action](./color-picker-in-action.gif)

# Installation

```bash
$ npm install --save cycle-color-picker

```

# Usage

Import Cycle Color Picker into your project. Cycle Color Picker takes in a stream of colors, and returns a stream of colors based on the user's input.

[Check out the example](http://raquelxmoss.github.io/cycle-color-picker)

```js
// index.js
import ColorPicker from 'cycle-color-picker';
```

Create a Color Picker component, passing it a stream of colors, as well as the DOM driver and Mouse driver.

You can pass colors to Cycle Color Picker as `hex`,` rgb(a)`, `hsl(a)`, or a named color (e.g. `aliceblue`). If no color is passed to Cycle Color Picker, the initial color will default to white. You'll also need to pass in a DOM driver.

```js
const props$ = xs.of({color: '#C3209f'});
const colorPicker = ColorPicker({DOM, props$});
```

Cycle Color Picker returns `DOM`, and `color$`, which you can access in your app. To display Cycle Color Picker, pass its DOM into your view function.

Here's a simple example of a Color Picker that changes the background color of the app. To see how to use Cycle Color Picker with Cycle's isolate function, [check out the example](http://raquelxmoss.github.io/cycle-color-picker').

```js
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, makeDOMDriver} from '@cycle/dom';
import ColorPicker from 'cycle-color-picker';

const drivers = {
  DOM: makeDOMDriver('.app'),
};

function view (state) {
  const containerStyle = {background: state.color};

  return (
    div('.container', {style: containerStyle}, [state.vtree])
  );
}

function main ({DOM}) {
  const props$ = xs.of({color: '#C3209F'});
  const colorPicker = ColorPicker({DOM, props$});

  const state$ = xs.combine(
    colorPicker.DOM,
    colorPicker.color$
  );

  return {
    DOM: state$.map(([vtree, color]) => view({vtree, color}))
  };
}

run(main, drivers);
```

# FAQ

### Can I use multiple color pickers within my app?

Yes! Cycle Color Picker can be used with Cycle's `isolate()`. [Read the documentation for `isolate()`](https://github.com/cyclejs/cyclejs/tree/master/isolate), and check out the [example](http://raquelxmoss.github.io/cycle-color-picker).

### Can I use this with RxJs?

Not yet! I'm hoping to work towards stream library diversity soon.

# Thanks

- To [Nick Johnstone](http://www.github.com/widdershin) for help and advice, particularly with architecture concerns 😇👏
- To [React Color](http://casesandberg.github.io/react-color/) for heaps of inspiration, and for saving me from doing some maths 🎨👏
- To [TinyColor](https://github.com/bgrins/TinyColor) for being such a great library for converting colors ✨👏
