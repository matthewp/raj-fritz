# Raj Fritz

> [Fritz](https://fritz.work/) bindings for [Raj](https://github.com/andrejewski/raj)

# Installation

```
yarn add raj-fritz
```

# Usage

```js
import { program } from 'raj-fritz';
import fritz, { h } from 'fritz';

const counterProgram = {
  init: [0],
  update (message, count) {
    switch(message) {
      case 'increment':
        return [count + 1];
      default:
        return [count];
    }
  },
  view (count, dispatch) {
    return (
      <div>
        <div>Count: {count}</div>
        <button onClick={() => dispatch('increment')}>Click me</button>
      </div>
    );
  }
};

const App = program(fritz.Component, helloProgram);

fritz.define('basic-app', App);
```

# Documentation

__TODO__

# License

BSD-2-Clause
