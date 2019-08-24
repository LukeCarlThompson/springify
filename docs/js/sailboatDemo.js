import Springify from "../../dist/springify.esm.js";

export default function() {
  const sailboat = document.querySelector(".sailboat");
  const sailAway = document.querySelector(".sailboat--away");
  const sailBack = document.querySelector(".sailboat--back");

  const sailboatCallback = x => {
    sailboat.style.left = `${x.output}%`;
    sailboat.style.transform = `rotate(${x.velocity * -0.2}deg)`;
  };

  const springySailboat = new Springify(
    {
      propName: "x",
      input: 10,
      stiffness: 10,
      damping: 80,
      mass: 50,
    },
    sailboatCallback
  );

  sailAway.addEventListener("click", () => {
    springySailboat.x.input = 90;
    springySailboat.animate();
  });

  sailBack.addEventListener("click", () => {
    springySailboat.x.input = 10;
    springySailboat.animate();
  });
};
