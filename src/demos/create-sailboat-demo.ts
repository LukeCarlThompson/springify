import { Springify } from '../implementation';

export function createSailboatDemo() {
  const sailboat = document.querySelector('.sailboat') as HTMLElement | null;
  const sailAway = document.querySelector('.sailboat--away');
  const sailBack = document.querySelector('.sailboat--back');

  if (!sailboat) {
    throw new Error('unable to find sailboat element');
  }

  if (!sailAway) {
    throw new Error('unable to find sailAway element');
  }

  if (!sailBack) {
    throw new Error('unable to find sailBack element');
  }

  let direction = 'right';

  const springySailboat = new Springify({
    stiffness: 10,
    damping: 80,
    mass: 50,
  });

  springySailboat.subscribe(({ output, velocity }) => {
    sailboat.style.transform = `rotate(${velocity * -0.3}deg) scaleX(${direction === 'right' ? -1 : 1})`;
    sailboat.style.left = `${output}%`;
  });

  sailAway.addEventListener('click', () => {
    springySailboat.input = 100;
    direction = 'right';
  });

  sailBack.addEventListener('click', () => {
    springySailboat.input = 0;
    direction = 'left';
  });
}
