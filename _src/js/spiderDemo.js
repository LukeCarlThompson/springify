import Springify from "../../dist/springify.esm.js";

export default function() {
  const spider = document.querySelector(".spider");
  const spiderArea = document.querySelector(".section--example-spider");

  const springySpider = new Springify(
    {
      propName: "x",
      stiffness: 30,
      damping: 50,
      mass: 10,
    },
    function(x) {
      spider.style.transform = `translateY(${x.output}px)`;
    }
  );

  window.addEventListener("scroll", () => {
    springySpider.x.input =
      window.scrollY - spiderArea.offsetTop + window.innerHeight * 0.5;
    springySpider.animate();
  });
}
