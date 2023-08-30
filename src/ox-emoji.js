import { createSvgElement } from './svg';
import { colors } from './colors';

export const emojiOx = createSvgElement('svg');
emojiOx.setAttribute('viewBox', '0 0 16 16');
emojiOx.setAttribute('stroke-linecap', 'round');
emojiOx.style.width = '48px';
emojiOx.style.height = '48px';

const body = createSvgElement('path');
body.setAttribute('fill', colors.ox);
body.setAttribute('d', 'M15 2h-4c-1 0-5 0-6 2l-2 5c-1 2 0 5 2 5h4 l2 2z');

const horn = createSvgElement('path');
horn.setAttribute('fill', colors.oxHorn);
horn.setAttribute('d', 'M12 3c-2 2-5-1-7-1s-3-.5-3-1c0-.5 2-1 4-1s8 1 6 3z');

const eye = createSvgElement('circle');
eye.setAttribute('cx', 8);
eye.setAttribute('cy', 6);
eye.setAttribute('r', 1);
eye.setAttribute('fill', colors.ui);

emojiOx.append(body, horn, eye);
