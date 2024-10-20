import type { EventName, SpringifyInterface, SpringifyProps, Subscriber, Unsubscribe } from '../springify';

/**
 * Takes a percent value and returns the number within min/max range
 * @param percent The input value to convert to a percentage.
 * @param min The minimum limit of the range.
 * @param max The maximum limit of the range.
 * @returns A value from 0 - 100 within the min and max
 */
const percentToValueBetweenRange = (percent: number, min: number, max: number): number =>
  (percent * (max - min)) / 100 + min;

export const springify = ({
  input = 0,
  stiffness = 10,
  damping = 30,
  mass = 20,
}: SpringifyProps): SpringifyInterface => {
  let output = input;
  let velocity = 0;
  let animating = false;
  let amplitude = 0;
  let delta = 0;
  let currentTime = Date.now();
  let lastTime = 0;
  let animationFrame = 0;

  const interpolate = () => {
    stiffness = percentToValueBetweenRange(stiffness, -1, -300);
    damping = percentToValueBetweenRange(damping, -0.4, -20);
    mass = percentToValueBetweenRange(mass, 0.1, 10);
    const springX = stiffness * (output - input);
    const damperX = damping * velocity;
    amplitude = (springX + damperX) / mass;
    console.log('interpolate -->', { stiffness, output, input, damping, velocity });
    velocity += amplitude * (delta / 1000);
    output += velocity * (delta / 1000);
  };

  const animLoop = () => {
    currentTime = Date.now();
    if (!animating) lastTime = currentTime - 1;
    delta = currentTime - lastTime;
    lastTime = currentTime;

    animating = true;
    interpolate();

    frameSubscribers.forEach((subscriber) => {
      subscriber({ output, velocity });
    });

    animating = !(Math.abs(velocity) < 0.1 && Math.abs(output - input) < 0.01);

    // If not finished then cancel any queued frame and animate another frame
    if (animating) {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(animLoop);
    } else {
      animating = false;
      output = input;
      endSubscribers.forEach((subscriber) => {
        subscriber({ output, velocity });
      });
    }
  };

  const animate = () => {
    if (!animating) {
      animLoop();
    }
  };

  let frameSubscribers: Set<Subscriber> = new Set();
  let endSubscribers: Set<Subscriber> = new Set();

  const subscribe = (subscriber: Subscriber, eventName: EventName = 'frame'): Unsubscribe => {
    let unsubscribe: () => void;

    if (eventName == 'frame') {
      frameSubscribers.add(subscriber);
      unsubscribe = () => {
        frameSubscribers.delete(subscriber);
      };
    } else {
      endSubscribers.add(subscriber);
      unsubscribe = () => {
        endSubscribers.delete(subscriber);
      };
    }

    return unsubscribe;
  };

  const settings = {
    set input(value: number) {
      input = value;
      animate();
    },
    get input() {
      return input;
    },
    get output() {
      return output;
    },
    set stiffness(value: number) {
      stiffness = value;
    },
    get stiffness() {
      return stiffness;
    },
    set damping(value: number) {
      damping = value;
    },
    get damping() {
      return damping;
    },
    set mass(value: number) {
      mass = value;
    },
    get mass() {
      return mass;
    },
    subscribe,
  };

  return settings;
};
