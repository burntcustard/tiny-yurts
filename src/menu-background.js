import { createElement } from './create-element';

export const menuBackground = createElement();

// This has to be a sibling element, behind the gameoverScreen, not a child of it,
// so that the backdrop-filter can transition properly
menuBackground.style.cssText = 'backdrop-filter:blur(8px);position:absolute;inset:0;pointer-events:none;background:#fffb;';

export const initMenuBackground = () => {
  document.body.append(menuBackground);
  menuBackground.style.opacity = 0;
};
