import { Springify } from '../springify';

export default function () {
  const helicopter = document.querySelector('.helicopter') as HTMLElement | null;
  const helicopterDemo = document.querySelector('.section--example-helicopter') as HTMLElement | null;

  const springResults = {
    x: 0,
    y: 0,
    velocity: 0,
  };

  const helicopterTransform = (x: number, y: number, rotation: number) => {
    return `translate(${x}px, ${y}px) rotate(${rotation * 0.05}deg)`;
  };

  const springyHelicopter = {
    x: new Springify({
      onFrame: (output, velocity) => {
        springResults.x = output;
        springResults.velocity = velocity;
        if (!helicopter) return;
        helicopter.style.transform = helicopterTransform(springResults.x, springResults.y, springResults.velocity);
      },
    }),
    y: new Springify({
      onFrame: (output) => {
        springResults.y = output;
      },
    }),
  };

  const helicopterMove = (clientX: number, clientY: number) => {
    if (!helicopter || !helicopterDemo) return;
    // normalize the mouse coordinates to the helicopter demo area
    const helicopterDemoRect = helicopterDemo.getBoundingClientRect();
    const relativeX = clientX - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

    const relativeY = clientY - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

    // Send our updated values as the inputs to the spring
    springyHelicopter.x.input = relativeX;
    springyHelicopter.y.input = relativeY;
  };

  if (helicopterDemo === null) return;
  helicopterDemo.addEventListener('mousemove', (e: MouseEventInit) => {
    if (!e.clientX || !e.clientY) return;
    helicopterMove(e.clientX, e.clientY);
  });

  helicopterDemo.addEventListener('touchmove', (e: TouchEventInit) => {
    if (e.touches === undefined) return;
    helicopterMove(e.touches[0].clientX, e.touches[0].clientY);
  });
}
