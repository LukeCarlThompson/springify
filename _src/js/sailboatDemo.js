import Springify from "../../dist/springify.esm.js";

export default function() {
  const springySailboat = new Springify(
    {
      propName: "x",
      stiffness: 10,
      damping: 80,
      mass: 50,
    },
    function(x) {
      sailboat.style.transform = `translateX(${x.output}%) rotate(${x.velocity * -0.3}deg)`;
    }
  );

  const sailboat = document.querySelector(".sailboat");
  const sailAway = document.querySelector(".sailboat--away");
  const sailBack = document.querySelector(".sailboat--back");

  sailAway.addEventListener("click", () => {
    springySailboat.x.input = 100;
    springySailboat.animate();
  });

  sailBack.addEventListener("click", () => {
    springySailboat.x.input = 0;
    springySailboat.animate();
  });
}
