import { init, GameLoop } from 'kontra';
import { Yurt } from './yurt';
import { createSvgElement, svgElement } from './svg';
import { initPointer } from './pointer';
import { OxFarm } from './ox-farm';
import { people } from './person';
import { inventory } from './inventory';

init(null, { contextless: true });

// TODO: Move elsewhre and minify
const styles = document.createElement('style');
styles.innerText = `
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
    font-weight: bold;
    font-family: system-ui;
    font-size: 12px;
    pointer-events: all;
  }
  button > div {
    display: grid;
    place-items: center;
    width: 56px;
    aspect-ratio: 1;
    background: #333f;
    border-radius: 50%;
    transition: all.3s;
    overflow: hidden;
    color: #fffe;
    backdrop-filter: blur(4px);
  }
  button div + div {
    position: absolute;
    right: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #eee;
    border: 4px solid #333;
    transform: translateX(50%);
    color: #333;
  }
  button:hover div {
    border-color: #333b;
    background: #333b;
    color: #fff;
  }
  button:hover div + div {
    background: #fff;
    color: #333;
    border: 4px solid #333;
  }
`.trim();
document.head.appendChild(styles);

document.body.style.cssText = `
  margin: 0;
`;

// Add HTML UI elements (?)
const uiContainer = document.createElement('div');
uiContainer.style.cssText = 'position:absolute;inset:0;display:grid;justify-content:center;padding:12px;pointer-events:none;'
document.body.appendChild(uiContainer);

const menuButton = document.createElement('button');
menuButton.style.cssText = `
  align-self: start;
  justify-self: start;
`;
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


if (inventory.paths > 0) {
  // pathTilesButton.style.background = '#eee';
} else {
  // pathTilesButton.style.background = '#aaa';
}
pathTilesButtonInner.append(pathTilesSvg);
pathTilesSvg.append(pathTilesPath);
pathTilesButtonInner.style.transform = 'rotate(-45deg)';
pathTilesSvg.style.transform = 'rotate(45deg)';
pathTilesButtonInner.style.width = '48px'
pathTilesButtonInner.style.borderRadius = '12px';
const pathTilesCount = document.createElement('div');
pathTilesButton.append(pathTilesCount);
const deleteButton = document.createElement('button');
const deleteButtonInner = document.createElement('div');
deleteButton.style.transform = 'scale(.7)';
deleteButton.append(deleteButtonInner);
const otherButton = document.createElement('button');
buildBar.append(deleteButton, pathTilesButton, otherButton);
uiContainer.append(menuButton, buildBar);

setTimeout(() => {
  const testYurt = new Yurt({ x: 6, y: 7, type: 'ox' });
  testYurt.addToSvg();
}, 0);

setTimeout(() => {
  const testYurt2 = new Yurt({ x: 5, y: 5, type: 'ox' });
  testYurt2.addToSvg();
}, 500);

setTimeout(() => {
  const testYurt3 = new Yurt({ x: 7, y: 5, type: 'ox' });
  testYurt3.addToSvg();
}, 500);

let testOxFarm;

setTimeout(() => {
  testOxFarm = new OxFarm({ width: 3, height: 2, x: 1, y: 6 });
}, 1000);

initPointer(svgElement);

let updateCount = 0;
let renderCount = 0;

let totalUpdateCount = 0;

const loop = GameLoop({
  update() {
    updateCount++;
    totalUpdateCount++;
    // if (totalUpdateCount > 200) return;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser refresh rate anyway
    switch (updateCount % 4) {
      case 0:
        break;
      case 1:
        testOxFarm.update();
        break;
      case 2:
        break;
      case 3:
        break;
    }

    if (updateCount >= 60) updateCount = 0;

    people.forEach(p => p.update());
  },
  render() {
    renderCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser refresh rate anyway
    switch (renderCount % 4) {
      case 0:
        pathTilesCount.innerText = inventory.paths;
        break;
      case 1:
        testOxFarm.render();
        break;
      case 2:
        break;
      case 3:
        break;
    }
    if (renderCount >= 60) renderCount = 0;

    people.forEach(p => p.render());
  },
});

setTimeout(() => {
  loop.start();
}, 3000);
