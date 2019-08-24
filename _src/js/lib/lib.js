
// TODO: Interpolate the stiffness and damping to make sane ranges. maybe 0 - 1 for each;

// TODO: Make the function take an array of targets and create seperate props for each one. Run the animate function over each value and then pass all values into the callback function. So it can be used for any number of inputs and outputs.

// TODO: How to set up default parameters object properly.


function springify({
  x = {
    stiffness: -5,
    damping: -0.97,
  },
  y = {
    stiffness: -5,
    damping: -0.97,
  },
  callback = () => {},
} = {}) {

  this.x = {
    stiffness: x.stiffness,
    damping: x.damping,
    input: 0,
    output: 0,
    velocity: 0,
    amplitude: 0,
    mass: 0.2,
  };

  this.y = {
    stiffness: y.stiffness,
    damping: y.damping,
    input: 0,
    output: 0,
    velocity: 0,
    amplitude: 0,
    mass: 0.2,
  };

  this.animating = false;

  let lastTime;

  this.animate = () => {
    const currentTime = Date.now();
    if (!this.animating) lastTime = currentTime - 1;
    const timeSinceLastFrame = currentTime - lastTime;
    lastTime = currentTime;

    this.animating = true;

    // Do the maths for X value
    const springX = this.x.stiffness * (this.x.output - this.x.input);
    const damperX = this.x.damping * this.x.velocity;
    this.x.amplitude = (springX + damperX) / this.x.mass;
    this.x.velocity += this.x.amplitude * (timeSinceLastFrame / 1000);
    this.x.output += this.x.velocity * (timeSinceLastFrame / 1000);

    // Do the maths for Y value
    const springY = this.y.stiffness * (this.y.output - this.y.input);
    const damperY = this.y.damping * this.y.velocity;
    this.y.amplitude = (springY + damperY) / this.y.mass;
    this.y.velocity += this.y.amplitude * (timeSinceLastFrame / 1000);
    this.y.output += this.y.velocity * (timeSinceLastFrame / 1000);

    // execute the callback function and pass in our springified values
    callback(this.x, this.y);

    // returns true if velocity is less than 0.5 and output is less than 0.5 from input
    const finished =
      Math.abs(this.x.velocity) < 0.5 &&
      Math.abs(this.x.output - this.x.input) < 0.5 &&
      Math.abs(this.y.velocity) < 0.5 &&
      Math.abs(this.y.output - this.y.input) < 0.5;

    // If not finished then animate another frame
    if (!finished) {
      requestAnimationFrame(this.animate);
    } else {
      this.animating = false;
      // Set to the exact input because we might have stopped one frame away
      this.x.output = this.x.input;
      this.y.output = this.y.input;
      console.log("finished spring animation");
    }
  };
}

export default springify;
