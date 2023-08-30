import { colors } from './colors';

export const demoColors = () => {
  const colorTestContainer = document.createElement('svg');
  colorTestContainer.style.cssText = ('position:absolute;left:8px;bottom:32px;display:grid;gap:8px;');
  document.body.append(colorTestContainer);
  for (const [name, value] of Object.entries(colors)) {
    const dot = document.createElement('div');
    dot.style.cssText = 'display:block;width:16px;height:16px;border-radius:50%;overflow:visible;';
    dot.innerHTML = `<pre style="margin:3px;padding-left:20px;font-size:10px">${value}: ${name}</pre>`;
    dot.style.background = value;
    colorTestContainer.append(dot);
  }
};
