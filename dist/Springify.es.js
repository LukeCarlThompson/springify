var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Springify {
  constructor({
    input = 0,
    stiffness = 10,
    damping = 30,
    mass = 20,
    onFrame = () => {
    },
    onFinished = () => {
    }
  }) {
    __publicField(this, "_input");
    __publicField(this, "output");
    __publicField(this, "stiffness");
    __publicField(this, "damping");
    __publicField(this, "mass");
    __publicField(this, "velocity", 0);
    __publicField(this, "amplitude", 0);
    __publicField(this, "animating");
    __publicField(this, "onFrame");
    __publicField(this, "onFinished");
    __publicField(this, "lastTime");
    __publicField(this, "currentTime");
    __publicField(this, "delta");
    __publicField(this, "animationFrame");
    __publicField(this, "interpolate");
    __publicField(this, "animate");
    __publicField(this, "animLoop");
    this.animating = false;
    this.onFrame = onFrame;
    this.onFinished = onFinished;
    this.lastTime = 0;
    this.currentTime = 0;
    this.delta = 0;
    this.animationFrame = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this._input = input;
    this.output = this.input;
    const percentToValueBetweenRange = (percent, min, max) => percent * (max - min) / 100 + min;
    this.interpolate = () => {
      const stiffness2 = percentToValueBetweenRange(this.stiffness, -1, -300);
      const damping2 = percentToValueBetweenRange(this.damping, -0.4, -20);
      const mass2 = percentToValueBetweenRange(this.mass, 0.1, 10);
      const springX = stiffness2 * (this.output - this.input);
      const damperX = damping2 * this.velocity;
      this.amplitude = (springX + damperX) / mass2;
      this.velocity += this.amplitude * (this.delta / 1e3);
      this.output += this.velocity * (this.delta / 1e3);
    };
    this.animLoop = () => {
      this.currentTime = Date.now();
      if (!this.animating)
        this.lastTime = this.currentTime - 1;
      this.delta = this.currentTime - this.lastTime;
      this.lastTime = this.currentTime;
      this.animating = true;
      this.interpolate();
      this.onFrame(this.output, this.velocity);
      this.animating = !(Math.abs(this.velocity) < 0.1 && Math.abs(this.output - this.input) < 0.01);
      if (this.animating) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(this.animLoop);
      } else {
        this.animating = false;
        this.onFinished();
      }
    };
    this.animate = () => {
      if (!this.animating) {
        this.animLoop();
      }
    };
  }
  set input(value) {
    this._input = value;
    this.animate();
  }
  get input() {
    return this._input;
  }
}
export { Springify };
