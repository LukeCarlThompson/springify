import Springify from "../../dist/springify.esm.js";

export default function() {
  const springyHelicopter = new Springify(
    {
      propName: "x",
    },
    {
      propName: "y",
    },
    function(x, y) {
      helicopter.style.transform = `translate(${x.output}px, ${
        y.output
      }px) rotate(${x.velocity * 0.05}deg)`;
    }
  );

  const helicopter = document.querySelector(".helicopter");
  const helicopterDemo = document.querySelector(".section--example-helicopter");

  const helicopterMove = (clientX, clientY) => {
    // normalize the mouse coordinates to the helicopter demo area
    const helicopterDemoRect = helicopterDemo.getBoundingClientRect();
    const relativeX =
    clientX - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

    const relativeY =
      clientY - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

    // Send our updated values as the inputs to the spring
    springyHelicopter.x.input = relativeX;
    springyHelicopter.y.input = relativeY;

    // Start the animation
    springyHelicopter.animate();
  };

  helicopterDemo.addEventListener("mousemove", e => helicopterMove(e.clientX, e.clientY));
  helicopterDemo.addEventListener("touchmove", e => {
    helicopterMove(e.touches[0].clientX, e.touches[0].clientY);
  });
}
