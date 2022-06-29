# Springify.js 🌿

### A tiny lil' (under 1kb gzip) utility function for creating dynamic spring animations.

## Docs and demos here.

https://lukecarlthompson.github.io/springify.js

## Install via npm

```
npm i springify
```

## Basic usage

```
import { Springify } from 'springify';

const spring = new Springify({
  input: 0,
  onFrame: (output, velocity) => {
    // output is the output value from the spring
    // velocity is the velocity our spring is moving at
    console.log(output);
    console.log(velocity);
    }
  });

spring.input = 500;

// Update the input value and springify will spring from the initial input value to the new one. It automatically starts the animation running when the input value is set.

```
