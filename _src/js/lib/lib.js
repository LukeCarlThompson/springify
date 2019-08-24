
/* 
stiffness: effective range from 0 - 100;
damping: effective range from 0 - 100;
mass: effective range from 0 - 100;
*/

// TODO: clamp the output values to two decimal places
// TODO: Fire an event when the animation finishes

function Springify(...args) {

  this.animating = false;

  const defaults = {
    input: 0,
    stiffness: 10,
    damping: 30,
    mass: 20,
  };

  const template = {
    output: 0,
    velocity: 0,
    amplitude: 0,
  };

  // some vars to hold reference to time each frame was rendered
  let lastTime;
  let currentTime;
  let timeSinceLastFrame;

  // var to hold a reference to the animation frame so we can cancel it if need be.
  let animationFrame;

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
      this[arg.propName].stiffness = arg.input || defaults.input;
      this[arg.propName].stiffness = arg.stiffness || defaults.stiffness;
      this[arg.propName].damping = arg.damping || defaults.damping;
      this[arg.propName].mass = arg.mass || defaults.mass;
      this[arg.propName].input = arg.input || defaults.input;

      // Set the output to start from the input value in case it's not zero
      this[arg.propName].output = this[arg.propName].input;

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
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.animating = false;
      console.log("finished spring animation");
    }
  };
}

export default Springify;