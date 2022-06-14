import { Springify } from './Springify';

export default function () {
  const sailboat = document.querySelector('.sailboat') as HTMLElement | null;
  const sailAway = document.querySelector('.sailboat--away');
  const sailBack = document.querySelector('.sailboat--back');

  const springySailboat = new Springify({
    stiffness: 10,
    damping: 80,
    mass: 50,
    onFrame: (output, velocity) => {
      if (sailboat === null) return;
      sailboat.style.transform = `translateX(${output}%) rotate(${velocity * -0.3}deg)`;
    },
  });

  sailAway &&
    sailAway.addEventListener('click', () => {
      springySailboat.input = 100;
    });

  sailBack &&
    sailBack.addEventListener('click', () => {
      springySailboat.input = 0;
    });
}
