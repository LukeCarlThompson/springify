interface SpringifyProps {
  input?: number;
  /**
   * effective range from 0 - 100
   */
  stiffness?: number;
  /**
   * effective range from 0 - 100
   */
  damping?: number;
  /**
   * effective range from 0 - 100
   */
  mass?: number;
  onFrame: (output: number, velocity: number) => void;
  onFinished?: () => void;
}

export class Springify {
  private _input;
  set input(value: number) {
    this._input = value;
    this.animate();
  }
  get input() {
    return this._input;
  }
  public output;
  public stiffness;
  public damping;
  public mass;
  public velocity = 0;
  private amplitude = 0;
  private animating;
  private onFrame;
  private onFinished;
  private lastTime;
  private currentTime;
  private delta;
  private animationFrame;
  private interpolate;
  private animate;
  private animLoop;

  constructor({
    input = 0,
    stiffness = 10,
    damping = 30,
    mass = 20,
    onFrame = () => {},
    onFinished = () => {},
  }: SpringifyProps) {
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

    // Set the output to start from the input value for the first frame
    this.output = this.input;

    /**
     * Takes a percent value and returns the number within min/max range
     * @param percent The input value to convert to a percentage.
     * @param min The minimum limit of the range.
     * @param max The maximum limit of the range.
     * @returns A value from 0 - 100 within the min and max
     */
    const percentToValueBetweenRange = (percent: number, min: number, max: number) =>
      (percent * (max - min)) / 100 + min;

    this.interpolate = () => {
      const stiffness = percentToValueBetweenRange(this.stiffness, -1, -300);
      const damping = percentToValueBetweenRange(this.damping, -0.4, -20);
      const mass = percentToValueBetweenRange(this.mass, 0.1, 10);
      const springX = stiffness * (this.output - this.input);
      const damperX = damping * this.velocity;
      this.amplitude = (springX + damperX) / mass;
      this.velocity += this.amplitude * (this.delta / 1000);
      this.output += this.velocity * (this.delta / 1000);
    };

    this.animLoop = () => {
      this.currentTime = Date.now();
      if (!this.animating) this.lastTime = this.currentTime - 1;
      this.delta = this.currentTime - this.lastTime;
      this.lastTime = this.currentTime;

      this.animating = true;
      this.interpolate();

      this.onFrame(this.output, this.velocity);

      this.animating = !(Math.abs(this.velocity) < 0.1 && Math.abs(this.output - this.input) < 0.01);

      // If not finished then cancel any queued frame and animate another frame
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
}
