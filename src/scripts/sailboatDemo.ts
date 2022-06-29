import { Springify } from './Springify';

export default function () {
  const sailboat = document.querySelector('.sailboat') as HTMLElement | null;
  const sailAway = document.querySelector('.sailboat--away');
  const sailBack = document.querySelector('.sailboat--back');

  let direction = 'right';

  const springySailboat = new Springify({
    stiffness: 10,
    damping: 80,
    mass: 50,
    onFrame: (output, velocity) => {
      if (sailboat === null) return;
      sailboat.style.transform = `rotate(${velocity * -0.3}deg) scaleX(${direction === 'right' ? -1 : 1})`;
      sailboat.style.left = `${output}%`;
    },
  });

  sailAway &&
    sailAway.addEventListener('click', () => {
      springySailboat.input = 100;
      direction = 'right';
    });

  sailBack &&
    sailBack.addEventListener('click', () => {
      springySailboat.input = 0;
      direction = 'left';
    });
}
