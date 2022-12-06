import { Springify } from '../springify';

export default function () {
  const buttons = document.querySelectorAll('.demo-button') as NodeListOf<HTMLButtonElement>;

  buttons.forEach((button) => {
    const springyButton = new Springify({
      stiffness: 20,
      damping: 30,
      mass: 10,
      input: 1,
      onFrame: (output, velocity) => {
        button.style.transform = `scaleX(${output + velocity * 0.1}) scaleY(${output})`;
      },
    });

    button.addEventListener('mousedown', () => {
      springyButton.input = 0.75;
    });

    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      springyButton.input = 0.75;
    });

    button.addEventListener('mouseup', () => {
      springyButton.input = 1.1;
    });

    button.addEventListener('mouseenter', () => {
      springyButton.input = 1.1;
    });

    button.addEventListener('mouseout', () => {
      springyButton.input = 1;
    });

    button.addEventListener('touchend', () => {
      springyButton.input = 1;
    });
  });
}
