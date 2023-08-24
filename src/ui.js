import { createSvgElement } from './svg';

export const initUi = () => {
  // TODO: Move elsewhre and minify
  const styles = document.createElement('style');
  styles.innerText = `
    header {
      display: flex;
      justify-content:space-between;
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
  uiContainer.style.cssText = 'position:absolute;inset:0;display:grid;padding:12px;pointer-events:none;'
  document.body.append(uiContainer);

  const header = document.createElement('header');

  const menuButton = document.createElement('button');
  menuButton.style.cssText = `
    align-self: start;
    justify-self: start;
  `;
  const timeButton = document.createElement('button');
  const timeButtonSvg = createSvgElement('svg');
  timeButtonSvg.setAttribute('viewBox', '0 0 8 24');
  timeButtonSvg.style.width = '36px';
  timeButtonSvg.style.height = '36px';
  const timeButtonPath = createSvgElement('path');
  timeButtonPath.setAttribute('d', 'm4 16-2-14a2 2 0 1 1 4 0Z');
  const timeButtonSpinnyPath = createSvgElement('path');
  timeButtonSvg.append(timeButtonPath, timeButtonSpinnyPath);
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
  // pathTilesPath.setAttribute('d', 'M5.5 1 h1q2 0 2 2 0 2 -2 2h-3q-2 0-2 2 0 2 2 2h1');
  // pathTilesPath.setAttribute('d', 'M3 1 h1.5q1 0 1 1 0 1 -1 1h-2q-1 0 -1 1 0 1 1 1h2q 1 0 1 1 0 1 -1 1 h-1.5')
  pathTilesPath.setAttribute('d', 'M11 1h-3 q-2 0 -2 2t2 2h4q2 0 2 2t-2 2h-6q-2 0-2 2t2 2h4q2 0 2 2t-2 2h-3');
  pathTilesButton.append(pathTilesButtonInner);

  pathTilesButtonInner.append(pathTilesSvg);
  pathTilesSvg.append(pathTilesPath);
  pathTilesButtonInner.style.transform = 'rotate(-45deg)';
  pathTilesSvg.style.transform = 'rotate(45deg)';
  pathTilesButtonInner.style.width = '48px'
  pathTilesButtonInner.style.borderRadius = '12px';
  const pathTilesCountElement = document.createElement('div');
  pathTilesCountElement.style.paddingBottom = '0.5px'; // TODO: Uses too many bytes?
  pathTilesButton.append(pathTilesCountElement);
  const deleteButton = document.createElement('button');
  const deleteButtonInner = document.createElement('div');
  deleteButton.style.transform = 'scale(.7)';
  deleteButton.append(deleteButtonInner);
  const otherButton = document.createElement('button');
  buildBar.append(deleteButton, pathTilesButton, otherButton);
  uiContainer.append(header, buildBar);

  return { pathTilesCountElement };
}
