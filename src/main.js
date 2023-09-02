import {
  init, initKeys, onKey, GameLoop,
} from 'kontra';
import {
  svgElement, gridWidth, gridHeight, boardOffsetX, boardOffsetY, boardSvgWidth
} from './svg';
import { initPointer } from './pointer';
import { oxFarms } from './ox-farm';
import { goatFarms } from './goat-farm';
import { people } from './person';
import { inventory } from './inventory';
import { initUi } from './ui';
import { farms } from './farm';
import { svgPxToDisplayPx } from './cell';
import { spawnNewObjects } from './spawning';
import { demoColors } from './demo-colors';
import { initGameover, showGameover, hideGameover } from './gameover';
import { animals } from './animal';
import { oxen } from './ox';
import { goats } from './goat';
import { yurts } from './yurt';
import { paths } from './path';
import { clearLayers } from './layers';
import { initMenu, showMenu, hideMenu } from './menu';

let updateCount = 0;
let renderCount = 0;
let totalUpdateCount = 0;

const startNewGame = () => {
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;

  setTimeout(() => {
    goatFarms.length = 0;
    oxFarms.length = 0;
    people.length = 0;
    farms.length = 0;
    animals.length = 0;
    oxen.length = 0;
    goats.length = 0;
    yurts.length = 0;
    paths.length = 0;
    updateCount = 0;
    renderCount = 0;
    totalUpdateCount = 0;
    clearLayers();
    hideGameover();
    svgElement.style.transform = '';
    inventory.paths = 16;

    setTimeout(() => {
      // spawnNewObjects(totalUpdateCount, gameStarted, 2000);
      loop.start();
    }, 1000);
  }, 1000);
}

let gameStarted = false;

const gameoverToMenu = () => {
  gameStarted = false;
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;

  setTimeout(() => {
    goatFarms.length = 0;
    oxFarms.length = 0;
    people.length = 0;
    farms.length = 0;
    animals.length = 0;
    oxen.length = 0;
    goats.length = 0;
    yurts.length = 0;
    paths.length = 0;
    updateCount = 0;
    renderCount = 0;
    totalUpdateCount = 0;
    clearLayers();
    hideGameover();
    svgElement.style.transform = '';
    inventory.paths = 16;

    setTimeout(() => {
      spawnNewObjects(totalUpdateCount, gameStarted, 2000);
      showMenu(farms[0], true);
      loop.start();
    }, 1000);
  }, 1000);
}

const { pathTilesCountElement, timeButtonHand } = initUi();
initGameover(startNewGame, gameoverToMenu);
init(null, { contextless: true });
initKeys();
initPointer();

const startGame = () => {
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = `rotate(0) scale(1) translate(0, 0)`;
  hideMenu();
  gameStarted = true;
  updateCount = totalUpdateCount = 1;
};

demoColors();

initMenu(startGame);
spawnNewObjects(totalUpdateCount, 2500);
showMenu(farms[0], true);

const loop = GameLoop({
  update() {
    if (gameStarted) {
      spawnNewObjects(totalUpdateCount, gameStarted);

      timeButtonHand.style.transform = `rotate(${totalUpdateCount}deg)`;
    }

    updateCount++;
    totalUpdateCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser FPS anyway
    /* eslint-disable default-case */
    switch (updateCount % 4) {
      case 0:
        break;
      case 1:
        oxFarms.forEach((farm) => farm.update(gameStarted));
        break;
      case 2:
        goatFarms.forEach((farm) => farm.update(gameStarted));
        break;
      case 3:
        break;
    }

    if (updateCount >= 60) updateCount = 0;

    farms.forEach((f) => {
      if (!f.isAlive) {
        loop.stop();
        const farmPxPosition = svgPxToDisplayPx(
          f.x - gridWidth / 2 - boardOffsetX + f.width / 2,
          f.y - gridHeight / 2 - boardOffsetY + f.height / 2,
        );
        svgElement.style.transition = 'transform 2s ease-out .5s';
        svgElement.style.transform = `rotate(-17deg) scale(2) translate(${-farmPxPosition.x}px, ${-farmPxPosition.y}px)`;

        showGameover(startNewGame);
      }
    });

    people.forEach((p) => p.update());
  },
  render() {
    renderCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser FPS anyway
    switch (renderCount % 4) {
      case 0:
        pathTilesCountElement.innerText = inventory.paths;
        // TODO: Highlight in some way if 0 paths left
        break;
      case 1:
        oxFarms.forEach((farm) => farm.render());
        break;
      case 2:
        goatFarms.forEach((farm) => farm.render());
        break;
      case 3:
        break;
    }
    if (renderCount >= 60) renderCount = 0;

    people.forEach((p) => p.render());
  },
});

onKey('space', () => {
  if (loop.isStopped) {
    loop.start();
  } else {
    loop.stop();
  }
});

setTimeout(() => {
  loop.start();
}, 1000);
