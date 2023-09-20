import { colors } from './colors';
import { createElement } from './create-element';

export const demoColors = () => {
  const colorTestContainer = createElement('svg');
  colorTestContainer.style.cssText = (`position:absolute;left:8px;bottom:32px;display:grid;gap:8px;`);
  document.body.append(colorTestContainer);
  Object.entries(colors).forEach(([name, value]) => {
    const dot = createElement();
    dot.style.cssText = `display:block;width:16px;height:16px;border-radius:50%;overflow:visible;`;
    dot.innerHTML = `<pre style="margin:3px;padding-left:20px;font-size:10px">${value}: ${name}</pre>`;
    dot.style.background = value;
    colorTestContainer.append(dot);
  });
};
