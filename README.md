# Springify.js 🌿

### A tiny lil' (under 1kb gzip) utility function for creating dynamic spring animations.

## Docs and demos here.

https://lukecarlthompson.github.io/springify

## Install via npm

```
npm i springify
```

## Basic usage

```
import { Springify } from 'springify';

const spring = new Springify();

// Subscribe to updates. This will fire every frame and pass through the current values.
spring.subscribe(({ output, velocity }) => {
  // output is the output value from the spring
  // velocity is the velocity our spring is moving at
  console.log(output);
  console.log(velocity);
});

// Subscribe to the end event when the spring settles. This will fire once each time the spring stops.
spring.subscribe(({ output }) => {
  // output is the output value from the spring once it has settled
  console.log(output);
}, 'end');

// Update the value and springify will beging animating from the initial input value to the new one.
spring.input = 500;

```
