import {
  init, initKeys, onKey, GameLoop,
} from 'kontra';
import {
  svgElement, gridWidth, gridHeight, boardOffsetX, boardOffsetY, gridCellSize, boardWidth, boardHeight
} from './svg';
import { initPointer } from './pointer';
import { oxFarms } from './ox-farm';
import { goatFarms } from './goat-farm';
import { fishFarms } from './fish-farm';
import { people } from './person';
import { inventory } from './inventory';
import { initUi, goatCounter, goatCounterWrapper, oxCounter, oxCounterWrapper } from './ui';
import { farms } from './farm';
import { svgPxToDisplayPx } from './cell';
import { spawnNewObjects } from './spawning';
import { demoColors } from './demo-colors';
import { animals } from './animal';
import { oxen } from './ox';
import { goats } from './goat';
import { ponds } from './pond';
import { yurts } from './yurt';
import { paths } from './path';
import { clearLayers } from './layers';
import { initMenuBackground } from './menu-background';
import { initGameover, showGameover, hideGameover } from './gameover';
import { initMenu, showMenu, hideMenu } from './menu';
// import { Tree, trees } from './tree';

let updateCount = 0;
let renderCount = 0;
let totalUpdateCount = 0;

// const spawnTrees = () => {
//   for (let i = 0; i < 9; i++) {
//     new Tree({
//       x: Math.floor(Math.random() * gridWidth),
//       y: Math.floor(Math.random() * gridHeight),
//     });
//   }
// };

const startNewGame = () => {
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;

  oxCounterWrapper.style.width = 0;
  goatCounterWrapper.style.width = 0;
  oxCounter.innerText = 0;
  goatCounter.innerText = 0;

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
    ponds.length - 0;
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

  oxCounterWrapper.style.width = 0;
  goatCounterWrapper.style.width = 0;
  oxCounter.innerText = 0;
  goatCounter.innerText = 0;

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
    ponds.length = 0;
    updateCount = 0;
    renderCount = 0;
    totalUpdateCount = 0;
    clearLayers();
    hideGameover();
    svgElement.style.transform = '';
    inventory.paths = 16;

    setTimeout(() => {
      spawnNewObjects(totalUpdateCount, gameStarted, 2000);
      showMenu(farms[0]);
      loop.start();
    }, 750);
  }, 500);
}

const { pathTilesCountElement, pathTilesButton, timeButtonHand, timeButton } = initUi();
initMenuBackground();
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

// demoColors();

initMenu(startGame);
// spawnTrees();
spawnNewObjects(totalUpdateCount, 2500);

showMenu(farms[0], true);

const loop = GameLoop({
  update() {
    if (gameStarted) {
      spawnNewObjects(totalUpdateCount, gameStarted);

      if (totalUpdateCount === 500) {
        timeButton.style.opacity = 1;
      }

      if (totalUpdateCount === 400) {
        pathTilesButton.style.opacity = 1;
      }

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
        fishFarms.forEach((farm) => farm.update(gameStarted));
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

        oxCounterWrapper.style.opacity = 0;
        goatCounterWrapper.style.opacity = 0;
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
        fishFarms.forEach((farm) => farm.render());
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
