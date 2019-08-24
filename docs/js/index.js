import springify from "../../dist/libtemplate.esm.js";

console.log("Index.js file 😎");

const boxes = document.querySelectorAll(".box");
const boxOne = boxes[0];
const boxTwo = boxes[1];
const boxThree = boxes[2];

const arm = document.querySelector(".box-child");

const sigmoid = x => x / (1 + Math.abs(x * 0.01));

const callback = (x, y) => {
  // boxOne.style.transform = `scale(${1 + Math.abs(x.output * 0.01)})`;
  const sigmoidX = sigmoid(x.velocity * 0.1);
  // console.log(sigmoidX);
  boxOne.style.transform = `translate(${x.output - 200}px, ${y.output -
    200}px) rotate(${sigmoidX}deg)`;
  // arm.style.transform = `rotate(${sigmoidX}deg)`;
  // boxThree.style.transform = `translate3d(${x.velocity * 0.2}px, ${y.output}px, ${y.output}px)`;
};

const springyBox = new springify({
  x: {
    stiffness: -30,
    damping: -5,
  },
  // y: {
  //   stiffness: -10,
  //   damping: -1.4,
  // },
  callback: callback,
});

document.addEventListener("mousemove", e => {
  springyBox.x.input = e.clientX;
  springyBox.y.input = e.clientY;
  if (!springyBox.animating) {
    requestAnimationFrame(springyBox.animate);
  }
});

function Test(...args) {
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

  args.map(arg => {
    this[arg.name] = Object.assign({}, template);
    this[arg.name].stiffness = arg.stiffness || defaults.stiffness;
    this[arg.name].damping = arg.damping || defaults.damping;
    console.log(arg.stiffness);
  });

  console.table(this);
}

const testFunction = new Test(
  { name: "x", stiffness: true, damping: -35 },
  { name: "y", stiffness: 20 },
  { name: "z", stiffness: 30 }
);
