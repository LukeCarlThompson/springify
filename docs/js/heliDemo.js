import Springify from "../../dist/springify.esm.js";

export default function() {
  // Helicopter demo code
  const helicopter = document.querySelector(".helicopter");
  const helicopterDemo = document.querySelector(".section--example-helicopter");

  const helicopterCallback = (x, y) => {
    // The callback function uses requestAnimationFrame inside Springify.
    helicopter.style.transform = `translate(${x.output}px, ${
      y.output
    }px) rotate(${x.velocity * 0.05}deg)`;
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
    // normalize the coordinates to the helicopter demo area
    const helicopterDemoRect = helicopterDemo.getBoundingClientRect();
    const relativeX =
      e.clientX - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

    const relativeY =
      e.clientY - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

    // Send our updated values as the inputs to the spring
    springyHelicopter.x.input = relativeX;
    springyHelicopter.y.input = relativeY;

    // Start the animation
    springyHelicopter.animate();
  });
};
