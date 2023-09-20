import { createSvgElement } from './svg-utils';
import { colors } from './colors';

export const emojiGoat = () => {
  const svg = createSvgElement();
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('stroke-linecap', 'round');
  svg.style.width = '48px';
  svg.style.height = '48px';

  const body = createSvgElement('path');
  body.setAttribute('fill', colors.goat);
  body.setAttribute('d', 'M18 12c-2-3-4-8-7-8-4 0-10 5-10 9 0 3 6 3 8 3l2 4z');

  const horn1 = createSvgElement('path');
  horn1.setAttribute('fill', '#bcc');
  horn1.setAttribute('d', 'M7.4 7.5c-1-4 3.7-6 8-4 1 .4 1 1.3 0 1-3-1-6 1-4 4 1.1 1.6-3.2 2-4-1z');

  const horn2 = createSvgElement('path');
  horn2.setAttribute('fill', '#cdd');
  horn2.setAttribute('d', 'M6 5.8c-1-4 3.7-6 8-4 1 .4 1 1.3 0 1-3-1-6 1-4 4 1.1 1.6-3.2 2-4-1z');

  const beard = createSvgElement('path');
  beard.setAttribute('fill', '#cdd');
  beard.setAttribute('d', 'M6 15c0 4-2 5-2 4 0-2-1 0-1-1v-3z');

  const eye = createSvgElement('path');
  eye.setAttribute('d', 'm7 9.3 0 0');
  eye.setAttribute('stroke-width', 2);
  eye.setAttribute('stroke', colors.ui);

  svg.append(horn1, horn2, beard, body, eye);

  return svg;
};
