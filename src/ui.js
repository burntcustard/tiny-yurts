import { createSvgElement } from './svg-utils';
import { emojiOx } from './ox-emoji';
import { emojiGoat } from './goat-emoji';

export const oxCounterWrapper = document.createElement('div');
export const oxCounter = document.createElement('div');

export const goatCounterWrapper = document.createElement('div');
export const goatCounter = document.createElement('div');

export const initUi = () => {
  // TODO: Move elsewhre and minify
  const styles = document.createElement('style');
  styles.innerText = `
    body {
      font-family: system-ui;
      font-size: 20px;
      font-weight: 700;
      color: #443;
    }
    header {
      display: flex;
      justify-content:space-between;
      align-items: start;
    }
    header button {
      place-self: start;
    }
    footer {
      display: flex;
      gap: 20px;
      align-self: end;
      justify-content:center;
    }
    button {
      position:relative;
      display: grid;
      place-items: center;
      width: 56px;
      aspect-ratio: 1;
      border: none;
      padding: 0;
      background: 0;
      font-weight: 700;
      font-family: system-ui;
      font-size: 14px;
      pointer-events: all;
    }
    button > div {
      display: grid;
      place-items: center;
      width: 56px;
      aspect-ratio: 1;
      background: #443f;
      border-radius: 50%;
      transition: all.3s;
      overflow: hidden;
      color: #fffe;
      backdrop-filter: blur(4px);
    }
    button div + div {
      position: absolute;
      right: 0;
      width: 20px;
      height: 20px;
      padding-right: 0.5px;
      padding-bottom: 0.5px;
      border-radius: 50%;
      background: #eee;
      border: 4px solid #443;
      transform: translateX(50%);
      color: #443;
    }
    button:hover div {
      border-color: #443b;
      background: #443b;
      color: #fff;
    }
    button:hover div + div {
      background: #fff;
      color: #443;
      border: 4px solid #443;
    }
  `.trim();
  document.head.appendChild(styles);

  document.body.style.cssText = `
    margin: 0;
  `;

  // Add HTML UI elements (?)
  const uiContainer = document.createElement('div');
  uiContainer.style.cssText = 'position:absolute;inset:0;display:grid;padding:12px;pointer-events:none;';
  document.body.append(uiContainer);

  const header = document.createElement('header');

  const menuButton = document.createElement('button');
  menuButton.style.cssText = `
    align-self: start;
    justify-self: start;
  `;

  const counters = document.createElement('div');
  counters.style.cssText = 'display:flex;';
  header.append(counters);

  oxCounterWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;pointer-events:all;width:0;opacity:0;transition:width 1s,opacity 1s 1s';
  const oxCounterEmoji = emojiOx();
  oxCounterEmoji.style.width = '48px';
  oxCounterEmoji.style.height = '48px';
  oxCounterWrapper.append(oxCounterEmoji, oxCounter);
  counters.append(oxCounterWrapper);

  goatCounterWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;pointer-events:all;width:0;opacity:0;transition:width 1s,opacity 1s 1s';
  const goatCounterEmoji = emojiGoat();
  goatCounterEmoji.style.width = '48px';
  goatCounterEmoji.style.height = '48px';
  goatCounterWrapper.append(goatCounterEmoji, goatCounter);
  counters.append(goatCounterWrapper);

  const timeButton = document.createElement('button');
  timeButton.style.width = '64px';
  timeButton.style.height = '64px';
  const timeButtonSvg = createSvgElement('svg');
  timeButtonSvg.setAttribute('stroke-linejoin', 'round');
  timeButtonSvg.setAttribute('stroke-linecap', 'round');
  timeButtonSvg.setAttribute('viewBox', '0 0 16 16');
  timeButtonSvg.style.width = '64px';
  timeButtonSvg.style.height = '64px';
  timeButtonSvg.style.background = '#443';
  timeButtonSvg.style.borderRadius = '50%';

  for (let i = 75; i < 350; i += 25) {
    const dot = createSvgElement('path');
    dot.setAttribute('fill', 'none');
    dot.setAttribute('stroke', '#fff');
    dot.setAttribute('transform-origin', 'center');
    dot.setAttribute('d', 'm8 14.5v0');
    dot.style.transform = `rotate(${i}grad)`;
    timeButtonSvg.append(dot);
  }

  const timeButtonHand = createSvgElement('path');
  timeButtonHand.setAttribute('stroke', '#fff');
  timeButtonHand.setAttribute('transform-origin', 'center');
  timeButtonHand.setAttribute('d', 'm8 4v4');
  timeButtonSvg.append(timeButtonHand);

  timeButton.append(timeButtonSvg);

  header.append(menuButton, timeButton);
  const buildBar = document.createElement('footer');
  const pathTilesButton = document.createElement('button');
  const pathTilesButtonInner = document.createElement('div');
  const pathTilesSvg = createSvgElement('svg');
  pathTilesSvg.setAttribute('viewBox', '0 0 18 18');
  pathTilesSvg.style.width = '36px';
  pathTilesSvg.style.height = '36px';
  const pathTilesPath = createSvgElement('path');
  pathTilesPath.setAttribute('fill', 'none');
  pathTilesPath.setAttribute('stroke', 'currentColor');
  pathTilesPath.setAttribute('stroke-linejoin', 'round');
  pathTilesPath.setAttribute('stroke-linecap', 'round');
  pathTilesPath.setAttribute('stroke-width', 2);
  pathTilesPath.setAttribute('d', 'M11 1h-3 q-2 0 -2 2t2 2h4q2 0 2 2t-2 2h-6q-2 0-2 2t2 2h4q2 0 2 2t-2 2h-3');
  pathTilesButton.append(pathTilesButtonInner);
  pathTilesButtonInner.append(pathTilesSvg);
  pathTilesSvg.append(pathTilesPath);
  pathTilesButtonInner.style.transform = 'rotate(-45deg)';
  pathTilesSvg.style.transform = 'rotate(45deg)';
  pathTilesButtonInner.style.width = '48px';
  pathTilesButtonInner.style.borderRadius = '12px';
  const pathTilesCountElement = document.createElement('div');
  pathTilesButton.append(pathTilesCountElement);
  // const deleteButton = document.createElement('button');
  // const deleteButtonInner = document.createElement('div');
  // deleteButton.style.transform = 'scale(.7)';
  // deleteButton.append(deleteButtonInner);
  // const otherButton = document.createElement('button');
  // buildBar.append(deleteButton, pathTilesButton, otherButton);
  buildBar.append(pathTilesButton);
  uiContainer.append(header, buildBar);

  return {
    pathTilesCountElement,
    timeButtonHand,
    oxCounter,
    oxCounterWrapper,
    goatCounter,
    goatCounterWrapper,
  };
};
