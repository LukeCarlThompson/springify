
/* 
stiffness: effective range from 0 - 100;
damping: effective range from 0 - 100;
mass: effective range from 0 - 100;
*/

function Springify(...args) {

  this.animating = false;

  const defaults = {
    stiffness: 5,
    damping: 10,
    mass: 20,
  };

  const template = {
    input: 0,
    output: 0,
    velocity: 0,
    amplitude: 0,
  };

  // some vars to hold reference to time each frame was rendered
  let lastTime;
  let currentTime;
  let timeSinceLastFrame;

  // Create an array to hold a reference to all our prop objects
  const propObjects = [];

  // Takes a percent value and returns the number within min/max range.
  // Used to convert the stiffness and damping to easy inputs
  const percentToValueBetweenRange = (percent, min, max) => {
    return (percent * (max - min) / 100) + min;
  };

  args.map(arg => {
    // if arg has a propName property then add it to propName array, add the defaults to it and attach it to our springify instance.
    if(typeof arg.propName != 'undefined') {
      this[arg.propName] = Object.assign({}, template);
      this[arg.propName].stiffness = arg.stiffness || defaults.stiffness;
      this[arg.propName].damping = arg.damping || defaults.damping;
      this[arg.propName].mass = arg.mass || defaults.mass;
      // Push the propObject to our propObjects reference array
      propObjects.push(this[arg.propName]);
    } else {
      // Else it must be our callback, so assign that to the this.callback prop.
      this.callback = arg;
    }
  });


  // Takes in arg object and sets interpolated values on that object based on some spring physics equations
  const interpolate = (inputObj) => {
    const stiffness = percentToValueBetweenRange(inputObj.stiffness, -1, -300);
    const damping = percentToValueBetweenRange(inputObj.damping, -0.4, -20);
    const mass = percentToValueBetweenRange(inputObj.mass, 0.1, 10);
    const springX = stiffness * (inputObj.output - inputObj.input);
    const damperX = damping * inputObj.velocity;
    inputObj.amplitude = (springX + damperX) / mass;
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