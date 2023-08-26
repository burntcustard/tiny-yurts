import { init, initKeys, keyMap, onKey, offKey, GameLoop, keyPressed } from 'kontra';
import { svgElement } from './svg';
import { Yurt } from './yurt';
import { initPointer } from './pointer';
import { OxFarm } from './ox-farm';
import { people } from './person';
import { inventory } from './inventory';
import { initUi } from './ui';
import { oxen } from './ox';
import { goats } from './goat';
import { gridPointerHandler } from './grid';

init(null, { contextless: true });
initKeys();
const { pathTilesCountElement, timeButtonHand, oxCounter, goatCounter } = initUi();

setTimeout(() => {
  const testYurt = new Yurt({ x: 9, y: 7, type: 'ox' });
  testYurt.addToSvg();
}, 0);

setTimeout(() => {
  const testYurt2 = new Yurt({ x: 8, y: 5, type: 'ox' });
  testYurt2.addToSvg();
}, 500);

setTimeout(() => {
  const testYurt3 = new Yurt({ x: 10, y: 5, type: 'ox' });
  testYurt3.addToSvg();
}, 500);

let testOxFarm;

setTimeout(() => {
  testOxFarm = new OxFarm({ width: 3, height: 2, x: 4, y: 8 });
}, 1000);

initPointer();

let updateCount = 0;
let renderCount = 0;

let totalUpdateCount = 0;

let paused = false;

onKey('space', (e) => {
  paused = !paused;
});

const loop = GameLoop({
  update() {
    if (paused) {
      // If the game is paused, nothing updates, but everything is still rendered
      return;
    }

    updateCount++;
    totalUpdateCount++;

    timeButtonHand.style.transform = `rotate(${totalUpdateCount}deg)`;

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
        pathTilesCountElement.innerText = inventory.paths;
        // pathTilesCountElement.style.borderColor = inventory.paths && inventory.paths > 0 ? '' : 'red';
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
