import type { EventName, SpringifyInterface, SpringifyProps, Subscriber, Unsubscribe } from '../springify';

export class Springify implements SpringifyInterface {
  public stiffness;
  public damping;
  public mass;
  #input;
  #output;
  #velocity = 0;
  #amplitude = 0;
  #animating;
  #lastTime;
  #currentTime;
  #delta;
  #animationFrame;
  #frameSubscribers: Set<Subscriber> = new Set();
  #endSubscribers: Set<Subscriber> = new Set();

  constructor({ input = 0, stiffness = 10, damping = 30, mass = 20 }: SpringifyProps = {}) {
    this.#animating = false;
    this.#lastTime = 0;
    this.#currentTime = 0;
    this.#delta = 0;
    this.#animationFrame = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.#input = input;

    // Set the output to start from the input value for the first frame
    this.#output = input;
  }

  #animate = () => {
    if (!this.#animating) {
      this.#animLoop();
    }
  };

  #animLoop = () => {
    this.#currentTime = Date.now();
    if (!this.#animating) this.#lastTime = this.#currentTime - 1;
    this.#delta = this.#currentTime - this.#lastTime;
    this.#lastTime = this.#currentTime;

    this.#animating = true;
    this.#interpolate();

    this.#frameSubscribers.forEach((subscriber) => {
      subscriber({ output: this.#output, velocity: this.#velocity });
    });

    this.#animating = !(Math.abs(this.#velocity) < 0.1 && Math.abs(this.#output - this.#input) < 0.01);

    // If not finished then cancel any queued frame and animate another frame
    if (this.#animating) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = requestAnimationFrame(this.#animLoop);
    } else {
      this.#animating = false;
      this.#endSubscribers.forEach((subscriber) => {
        subscriber({ output: this.#output, velocity: this.#velocity });
      });
    }
  };

  /**
   * Takes a percent value and returns the number within min/max range
   * @param percent The input value to convert to a percentage.
   * @param min The minimum limit of the range.
   * @param max The maximum limit of the range.
   * @returns A value from 0 - 100 within the min and max
   */
  #percentToValueBetweenRange = (percent: number, min: number, max: number) => (percent * (max - min)) / 100 + min;

  #interpolate = () => {
    const stiffness = this.#percentToValueBetweenRange(this.stiffness, -1, -300);
    const damping = this.#percentToValueBetweenRange(this.damping, -0.4, -20);
    const mass = this.#percentToValueBetweenRange(this.mass, 0.1, 10);
    const springX = stiffness * (this.#output - this.#input);
    const damperX = damping * this.#velocity;
    this.#amplitude = (springX + damperX) / mass;
    this.#velocity += this.#amplitude * (this.#delta / 1000);
    this.#output += this.#velocity * (this.#delta / 1000);
  };

  set input(value: number) {
    this.#input = value;
    this.#animate();
  }
  get input() {
    return this.#input;
  }

  get output() {
    return this.#output;
  }

  public readonly subscribe = (subscriber: Subscriber, eventName: EventName = 'frame'): Unsubscribe => {
    let unsubscribe: () => void;

    if (eventName == 'frame') {
      this.#frameSubscribers.add(subscriber);
      unsubscribe = () => {
        this.#frameSubscribers.delete(subscriber);
      };
    } else {
      this.#endSubscribers.add(subscriber);
      unsubscribe = () => {
        this.#endSubscribers.delete(subscriber);
      };
    }

    return unsubscribe;
  };
}
