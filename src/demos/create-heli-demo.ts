import { Springify } from '../implementation';

export function createHeliDemo() {
  const helicopter = document.querySelector('.helicopter') as HTMLElement | null;
  const helicopterDemo = document.querySelector('.section--example-helicopter') as HTMLElement | null;

  if (!helicopter) {
    throw new Error('unable to find helicopter element');
  }

  if (!helicopterDemo) {
    throw new Error('unable to find helicopter demo section element');
  }

  const springyHelicopter = {
    x: new Springify(),
    y: new Springify(),
  };

  const helicopterTransform = (x: number, y: number, rotation: number) => {
    return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
  };

  springyHelicopter.x.subscribe(({ output, velocity }) => {
    helicopter.style.transform = helicopterTransform(output, springyHelicopter.y.output, velocity * 0.05);
  });

  const helicopterMove = (clientX: number, clientY: number) => {
    // normalize the mouse coordinates to the helicopter demo area
    const helicopterDemoRect = helicopterDemo.getBoundingClientRect();
    const relativeX = clientX - (helicopterDemoRect.left + helicopterDemoRect.width * 0.5);

    const relativeY = clientY - (helicopterDemoRect.top + helicopterDemoRect.height * 0.5);

    // Send our relative mouse values as the inputs to the springs
    springyHelicopter.x.input = relativeX;
    springyHelicopter.y.input = relativeY;
  };

  helicopterDemo.addEventListener('mousemove', (e: MouseEventInit) => {
    if (!e.clientX || !e.clientY) return;
    helicopterMove(e.clientX, e.clientY);
  });

  helicopterDemo.addEventListener('mouseout', () => {
    springyHelicopter.x.input = 0;
    springyHelicopter.y.input = 0;
  });

  helicopterDemo.addEventListener('touchmove', (e: TouchEventInit) => {
    if (e.touches === undefined) return;
    helicopterMove(e.touches[0].clientX, e.touches[0].clientY);
  });
}
