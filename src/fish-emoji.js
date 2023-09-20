import { createSvgElement } from './svg-utils';
import { colors } from './colors';

export const emojiFish = () => {
  const svg = createSvgElement();
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('stroke-linecap', 'round');

  const body = createSvgElement('path');
  body.setAttribute('fill', colors.fish);
  body.setAttribute('d', 'm17 11 1-4c1-4-5 0-5 4s6 8 5 4zM4 6.5c0-2 2-4 2-4 4 0 7 4 8 8m-11 4c4 2 14 6 6-2');

  const fins = createSvgElement('path');
  fins.setAttribute('fill', colors.fish);
  fins.setAttribute('d', 'm0 11c0 10 16 4 16 0s-16-12-16 0');

  const eye = createSvgElement('path');
  eye.setAttribute('d', 'm4 9 0 0');
  eye.setAttribute('stroke-width', 2);
  eye.setAttribute('stroke', colors.ui);

  svg.append(fins, body, eye);

  return svg;
};
