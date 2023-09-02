export const menuBackground = document.createElement('div');

// This has to be a sibling element, behind the gameoverScreen, not a child of it,
// so that the backdrop-filter can transition properly
menuBackground.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:#fffb;blur(8px);';
menuBackground.style.backdropFilter = 'blur(8px)';

export const initMenuBackground = () => {
  document.body.append(menuBackground);
  menuBackground.style.opacity = 0;
};
