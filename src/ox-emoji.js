import { createSvgElement } from './svg-utils';
import { colors } from './colors';

export const emojiOx = () => {
  const svg = createSvgElement();
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('stroke-linecap', 'round');

  const body = createSvgElement('path');
  body.setAttribute('fill', colors.ox);
  body.setAttribute('d', 'M15 2h-4c-1 0-5 0-6 2l-2 5c-1 2 0 5 2 5h4l2 2z');

  const horn = createSvgElement('path');
  horn.setAttribute('fill', colors.oxHorn);
  horn.setAttribute('d', 'M12 3c-2 2-5-1-7-1s-3-.5-3-1c0-.5 2-1 4-1s8 1 6 3z');

  const eye = createSvgElement('path');
  eye.setAttribute('d', 'm8 6 0 0');
  eye.setAttribute('stroke-width', 2);
  eye.setAttribute('stroke', colors.ui);

  svg.append(body, horn, eye);

  return svg;
};
