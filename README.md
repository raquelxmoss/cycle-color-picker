# Cycle Color Picker

A color picker component for Cycle.js. Cycle Color Picker is developed for usage within [Cycle](http://cycle.js.org/) applications using [xstream](https://github.com/staltz/xstream).

# Installation

Cycle Color Picker depends on [Cycle Mouse Driver](https://github.com/cyclejs-community/cycle-mouse-driver). You'll need to install and save both.

```bash
$ npm install --save cycle-color-picker cycle-mouse-driver

```

# Usage

Import Cycle Color Picker and Cycle Mouse Driver into your project. Cycle Color Picker takes in a stream of colors, and returns a stream of colors based on the user's input.

[Check out the example](http://raquelxmoss.github.io/cycle-color-picker)

```js
// index.js

import {makeMouseDriver} from 'cycle-mouse-driver';
import ColorPicker from 'cycle-color-picker';
```

Add Cycle Mouse Driver to your drivers Object, so that it is available to the Color Picker component.

```js
// index.js

const drivers = {
  Mouse: makeMouseDriver()
}

function main ({DOM, Mouse}) {
  // your main function
}

run(main, drivers);
```

Create a Color Picker component, passing it a stream of colors, as well as the DOM driver and Mouse driver.

You can pass colors to Cycle Color Picker as `hex`,` rgb(a)`, `hsl(a)`, or named color (e.g. `aliceblue`). If no color is passed to Cycle Color Picker, the initial color will default to white.

```js
const props$ = xs.of({color: '#C3209f'});

const colorPicker = ColorPicker({DOM, Mouse, props$});
```

Cycle Color Picker returns `DOM`, and `color$`, which you can access in your app. To display Cycle Color Picker in your app, pass its DOM into your view function.

Here's a simple example of a Color Picker that changes the background color of the app. To see how to use Cycle Color Picker with Cycle's isolate function, [check out the example](http://raquelxmoss.github.io/cycle-color-picker').

```js
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, makeDOMDriver} from '@cycle/dom';
import {makeMouseDriver} from 'cycle-mouse-driver';
import ColorPicker from 'cycle-color-picker';

const drivers = {
  DOM: makeDOMDriver('.app'),
  Mouse: makeMouseDriver()
};

function view (state) {
  const containerStyle = {background: state.color};

  return (
    div('.container', {style: containerStyle}, [state.vtree])
  );
}

function main ({DOM, Mouse}) {
  const props$ = xs.of({color: '#C3209F'});
  const colorPicker = ColorPicker({DOM, Mouse, props$});

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

### Why do I need to install a mouse driver too?

Cycle Color Picker needs to listen for mouseup events on the entire document, rather than just within the Color Picker component. As such, we need to use a driver. Unfortunately there's no nice way (yet) to seamlessly include a driver that is a dependency of a component, so you need to do a bit of manual work yourself, passing the Mouse and DOM drivers into the Color Picker component.

### What if I'm already using another mouse driver?

Yeah… sorry about that. There's two options here:

1. If `Cycle Mouse Driver` fulfills your needs, you could remove your existing mouse driver, and use `Cycle Mouse Driver`
2. You could rename your existing mouse driver in your sinks and sources (e.g. to `MouseDriver` rather than `Mouse`) and use it along with `Cycle Mouse Driver`

Neither option is ideal, really. I'm hoping to find a way to deal with injecting drivers in a less disruptive way.

### Can I use this with RxJs?

Not yet! I'm hoping to work towards stream library diversity soon.

# Thanks

- To [Nick Johnstone](http://www.github.com/widdershin) for help and advice, particularly with architecture concerns 😇👏
- To [React Color](http://casesandberg.github.io/react-color/) for heaps of inspiration, and for saving me from doing some maths 🎨👏
- To [TinyColor](https://github.com/bgrins/TinyColor) for being such a great library for converting colors ✨👏
