import Springify from "../../dist/libtemplate.esm.js";

console.log("Index.js file 😎");

// Example helicopter
const helicopter = document.querySelector(".helicopter");
const helicopterDemo = document.querySelector(".section--example-helicopter");

const helicopterCallback = (x, y) => {
  // Do any calculations and and adjustments in the callback function because this uses requestAnimationFrame inside Springify.

  // normalize the coordinates to the helicopter demo area
  const helicopterDemoRect = helicopterDemo.getBoundingClientRect();
  const relativeX =
    x.output - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

  const relativeY =
    y.output - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

  // Apply these to our helicopter
  helicopter.style.transform = `translate(${relativeX}px, ${relativeY}px) rotate(${x.velocity *
    0.05}deg)`;
};

const springyHelicopter = new Springify(
  {
    propName: "x",
  },
  {
    propName: "y",
  },
  helicopterCallback
);

helicopterDemo.addEventListener("mousemove", e => {
  // Just input the raw data here, no extra calculations for maximum efficiency.
  springyHelicopter.x.input = e.clientX;
  springyHelicopter.y.input = e.clientY;

  // If the Springify instance is not already animating then start animating again
  if (!springyHelicopter.animating) {
    springyHelicopter.animate();
  }
});

// End helicopter demo




const boxes = document.querySelectorAll(".box");
const boxOne = boxes[0];
const boxTwo = boxes[1];
const boxThree = boxes[2];

const arm = document.querySelector(".box-child");

const sigmoid = x => x / (1 + Math.abs(x * 0.01));

const callback = (x, y) => {
  const sigmoidX = sigmoid(x.velocity * 0.1);
  const sigmoidY = sigmoid(y.velocity * 0.1);
  boxOne.style.transform = `translate(${x.output - 200}px`;
  // boxOne.style.transform = `translate(${x.output - 200}px, ${y.output - 200}px) rotate(${sigmoidX}deg) scale(${1 + Math.abs(x.velocity * 0.0005)})`;
  // arm.style.transform = `rotate(${sigmoidY}deg)`;
  // boxThree.style.transform = `translate3d(${x.velocity * 0.2}px, ${y.velocity * 0.2}px, ${y.output}px)`;
};

// const springyBox = new Springify(
//   {
//     propName: "x",
//     stiffness: 10,
//     damping: 30,
//     mass: 20,
//   },
//   {
//     propName: "y",
//   },
//   callback
// );

// document.addEventListener("mousemove", e => {
//   springyBox.x.input = e.clientX;
//   springyBox.y.input = e.clientY;

//   if (!springyBox.animating) {
//     requestAnimationFrame(springyBox.animate);
//   }
// });

// document.addEventListener("click", e => {
//   springyBox.x.input = e.clientX;
//   springyBox.y.input = e.clientY;

//   if (!springyBox.animating) {
//     requestAnimationFrame(springyBox.animate);
//   }
// });
