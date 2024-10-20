import { Springify } from '../implementation';

export function createSpiderDemo() {
  const spider = document.querySelector('.spider') as HTMLElement;
  const spiderBody = document.querySelector('.spider__body') as HTMLElement;
  const spiderArea = document.querySelector('.section--example-spider') as HTMLElement;

  const springySpider = new Springify({
    stiffness: 30,
    damping: 50,
    mass: 10,
  });

  springySpider.subscribe(({ output, velocity }) => {
    spider.style.transform = `translateY(${output}px)`;
    spiderBody.style.transform = `rotate(${1 + Math.abs(velocity * 1)})`;
  });

  window.addEventListener('scroll', () => {
    springySpider.input = window.scrollY - spiderArea.offsetTop + window.innerHeight * 0.5;
  });
}
