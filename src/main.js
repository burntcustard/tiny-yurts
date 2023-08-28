import { init, initKeys, keyMap, onKey, offKey, GameLoop, keyPressed } from 'kontra';
import { svgElement, gridSvgWidth, gridSvgHeight, gridWidth, gridHeight, boardOffsetX, boardOffsetY } from './svg';
import { gridCellSize } from './grid';
import { Yurt } from './yurt';
import { initPointer } from './pointer';
import { OxFarm, oxFarms } from './ox-farm';
import { GoatFarm, goatFarms } from './goat-farm';
import { people } from './person';
import { inventory } from './inventory';
import { initUi } from './ui';
import { farms } from './farm';
import { svgPxToDisplayPx } from './cell';
import { spawnNewObjects } from './spawning';
import { demoColors } from './demo-colors';

let updateCount = 0;
let renderCount = 0;
let totalUpdateCount = 0;

const { pathTilesCountElement, timeButtonHand, gameoverScreen } = initUi();
init(null, { contextless: true });
initKeys();
initPointer();

demoColors();

const loop = GameLoop({
  update() {
    updateCount++;
    totalUpdateCount++;

    spawnNewObjects(totalUpdateCount);

    timeButtonHand.style.transform = `rotate(${totalUpdateCount}deg)`;

    // if (totalUpdateCount > 200) return;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser refresh rate anyway
    switch (updateCount % 4) {
      case 0:
        break;
      case 1:
        oxFarms.forEach(farm => farm.update());
        break;
      case 2:
        goatFarms.forEach(farm => farm.update());
        break;
      case 3:
        break;
    }

    if (updateCount >= 60) updateCount = 0;

    farms.forEach(f => {
      if (!f.isAlive) {
        loop.stop();
        const farmPxPosition = svgPxToDisplayPx(
          f.x - gridWidth / 2 - boardOffsetX + f.width / 2,
          f.y - gridHeight / 2 - boardOffsetY + f.height / 2,
        );
        svgElement.style.transition = 'transform 2s ease-out .5s';
        svgElement.style.transform = `rotate(-17deg) scale(2) translate(${-farmPxPosition.x}px, ${-farmPxPosition.y}px)`;

        gameoverScreen.style.backdropFilter = 'blur(8px)';
        gameoverScreen.style.background = '#fffb';
        gameoverScreen.style.opacity = 0.9;
        // TODO: White over the top fuzzy screen with restart button
      }
    });

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
        oxFarms.forEach(farm => farm.render());
        break;
      case 2:
        goatFarms.forEach(farm => farm.render());
        break;
      case 3:
        break;
    }
    if (renderCount >= 60) renderCount = 0;

    people.forEach(p => p.render());
  },
});

onKey('space', (e) => {
  if (loop.isStopped) {
    loop.start();
  } else {
    loop.stop();
  }
});

setTimeout(() => {
  loop.start();
}, 1000);
