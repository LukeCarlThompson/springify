import Springify from "../../dist/springify.esm.js";

import sailboatDemo from "./sailboatDemo.js";
import heliDemo from "./heliDemo.js";

heliDemo();
sailboatDemo();






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
