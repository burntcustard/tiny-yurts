import { createSvgElement } from "./svg"
import { colors } from "./colors";

export const emojiOx = createSvgElement('svg');
emojiOx.setAttribute('viewbox', '0 0 36 36');
emojiOx.style.width = '36px';
emojiOx.style.height = '36px';

const body = createSvgElement('path');
body.setAttribute('fill', colors.ox);
body.setAttribute('d', 'M34 14.4c-.4-1.8-2-3.4-4-3.4H9c-1 0-5.3 0-6 2L.7 19.3c-.7 2 .3 4.8 2.3 4.8h4C10 28 13 36 14 36c.8 0 1.6-3.4 1.9-6H27c.2 2.5.9 6 1.9 6 1 0 3-4.3 4.1-11a41 41 0 0 0 .9-7v9a1 1 0 1 0 2 0v-9c0-1.8-.7-3-2-3.6z');

const horn = createSvgElement('path');
horn.setAttribute('fill', colors.oxHorn);
horn.setAttribute('d', 'M10 12c-2 2-4.8-1-7-1s-3-.4-3-1c0-.5 1.8-1 4-1s8 1 6 3z');

const eye = createSvgElement('circle');
eye.setAttribute('cx', 6);
eye.setAttribute('cy', 16);
eye.setAttribute('r', 1);
eye.setAttribute('fill', colors.ui);

emojiOx.append(body, horn, eye);
