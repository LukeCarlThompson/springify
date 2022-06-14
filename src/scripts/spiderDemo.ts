import { Springify } from './Springify';

export default function () {
  const spider = document.querySelector('.spider') as HTMLElement;
  const spiderArea = document.querySelector('.section--example-spider') as HTMLElement;

  const springySpider = new Springify({
    stiffness: 30,
    damping: 50,
    mass: 10,
    onFrame: (output) => {
      spider.style.transform = `translateY(${output}px)`;
    },
  });

  window.addEventListener('scroll', () => {
    springySpider.input = window.scrollY - spiderArea.offsetTop + window.innerHeight * 0.5;
  });
}
