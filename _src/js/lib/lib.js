
// TODO: Interpolate the stiffness and damping to make sane ranges. maybe 0 - 1 for each;


function Springify(...args) {

  this.animating = false;

  const defaults = {
    stiffness: -5,
    damping: 0.97,
  };

  const template = {
    input: 0,
    output: 0,
    velocity: 0,
    amplitude: 0,
    mass: 0.2,
  };

  // some vars to hold reference to time each frame was rendered
  let lastTime;
  let currentTime;
  let timeSinceLastFrame;

  // Create an array to hold a reference to all our prop objects
  const propObjects = [];

  args.map(arg => {
    // if arg has a propName property then add it to propName array, add the defaults to it and attach it to our springify instance.
    if(typeof arg.propName != 'undefined') {
      this[arg.propName] = Object.assign({}, template);
      this[arg.propName].stiffness = arg.stiffness || defaults.stiffness;
      this[arg.propName].damping = arg.damping || defaults.damping;
      // Push the propObject to our propObjects reference array
      propObjects.push(this[arg.propName]);
    } else {
      // Else it must be our callback, so assign that to the this.callback prop.
      this.callback = arg;
    }
  });


  // Takes in arg object and sets interpolated values on that object based on some spring physics equations
  const interpolate = (inputObj) => {
    const springX = inputObj.stiffness * (inputObj.output - inputObj.input);
    const damperX = inputObj.damping * inputObj.velocity;
    inputObj.amplitude = (springX + damperX) / inputObj.mass;
    inputObj.velocity += inputObj.amplitude * (timeSinceLastFrame / 1000);
    inputObj.output += inputObj.velocity * (timeSinceLastFrame / 1000);
  };

  this.animate = () => {
    currentTime = Date.now();
    if (!this.animating) lastTime = currentTime - 1;
    timeSinceLastFrame = currentTime - lastTime;
    lastTime = currentTime;
    
    this.animating = true;

    propObjects.forEach(propObject => {
      interpolate(propObject);
    });

    // execute the callback function and pass in our prop objects array containing the springified values
    this.callback(...propObjects);

    const isFinished = propObjects.every( propObject => Math.abs(propObject.velocity) < 0.5 && Math.abs(propObject.output - propObject.input) < 0.5);

    // If not finished then animate another frame
    if (!isFinished) {
      requestAnimationFrame(this.animate);
    } else {
      this.animating = false;
      // TODO:  Set all output values to their exact input and run callback one more time.
      console.log("finished spring animation");
    }
  };
}

export default Springify;