var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const percentToValueBetweenRange = (percent, min, max) => percent * (max - min) / 100 + min;
class Springify {
  constructor({
    stiffness = 10,
    damping = 30,
    mass = 20,
    input = 0,
    onFrame = () => null,
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
    __publicField(this, "callback");
    __publicField(this, "lastTime");
    __publicField(this, "currentTime");
    __publicField(this, "delta");
    __publicField(this, "animationFrame");
    __publicField(this, "onFinished");
    __publicField(this, "interpolate", () => {
      const stiffness = percentToValueBetweenRange(this.stiffness, -1, -300);
      const damping = percentToValueBetweenRange(this.damping, -0.4, -20);
      const mass = percentToValueBetweenRange(this.mass, 0.1, 10);
      const springX = stiffness * (this.output - this.input);
      const damperX = damping * this.velocity;
      this.amplitude = (springX + damperX) / mass;
      this.velocity += this.amplitude * (this.delta / 1e3);
      this.output += this.velocity * (this.delta / 1e3);
    });
    __publicField(this, "animLoop", () => {
      this.currentTime = Date.now();
      if (!this.animating)
        this.lastTime = this.currentTime - 1;
      this.delta = this.currentTime - this.lastTime;
      this.lastTime = this.currentTime;
      this.animating = true;
      this.interpolate();
      this.callback(this.output, this.velocity);
      this.animating = !(Math.abs(this.velocity) < 0.2 && Math.abs(this.output - this.input) < 0.2);
      if (this.animating) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(this.animLoop);
      } else {
        this.animating = false;
        this.onFinished();
        console.log("finished spring animation");
      }
    });
    __publicField(this, "animate", () => {
      if (!this.animating) {
        this.animLoop();
      }
    });
    this.animating = false;
    this.callback = onFrame;
    this.lastTime = 0;
    this.currentTime = 0;
    this.delta = 0;
    this.animationFrame = 0;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.onFinished = onFinished;
    this._input = input;
    this.output = this.input;
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
