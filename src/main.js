import { init, GameLoop } from 'kontra';
import {
  svgElement, gridWidth, gridHeight, boardOffsetX, boardOffsetY, gridCellSize, boardWidth, boardHeight,
} from './svg';
import { initPointer } from './pointer';
import { oxFarms } from './ox-farm';
import { goatFarms } from './goat-farm';
import { fishFarms } from './fish-farm';
import { people } from './person';
import { inventory } from './inventory';
import {
  initUi, scoreCounters, goatCounter, goatCounterWrapper, oxCounter, oxCounterWrapper, fishCounter, fishCounterWrapper, pathTilesIndicator, pathTilesIndicatorCount, clock, clockHand, clockMonth, pauseButton, pauseSvgPath,
} from './ui';
import { farms } from './farm';
import { svgPxToDisplayPx } from './cell';
import { spawnNewObjects } from './spawning';
import { demoColors } from './demo-colors';
import { animals } from './animal';
import { oxen } from './ox';
import { goats } from './goat';
import { fishes } from './fish';
import { ponds } from './pond';
import { yurts } from './yurt';
import { paths } from './path';
import { clearLayers } from './layers';
import { initMenuBackground } from './menu-background';
import { initGameover, showGameover, hideGameover } from './gameover';
import { initMenu, showMenu, hideMenu } from './menu';
import { updateGridData } from './find-route';
import { colors } from './colors';
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
  fishCounterWrapper.style.width = 0;
  oxCounterWrapper.style.opacity = 0;
  goatCounterWrapper.style.opacity = 0;
  fishCounterWrapper.style.opacity = 0;
  oxCounter.innerText = 0;
  goatCounter.innerText = 0;
  fishCounter.innerText = 0;
  pauseButton.style.opacity = 0;

  setTimeout(() => {
    goatFarms.length = 0;
    oxFarms.length = 0;
    people.length = 0;
    farms.length = 0;
    animals.length = 0;
    oxen.length = 0;
    goats.length = 0;
    fishes.length = 0;
    yurts.length = 0;
    paths.length = 0;
    ponds.length = 0;
    updateCount = 1;
    totalUpdateCount = 1;
    renderCount = 1;
    inventory.paths = 9;
    pathTilesIndicatorCount.innerText = inventory.paths;
    clearLayers();
    hideGameover();
    svgElement.style.transform = '';

    setTimeout(() => {
      spawnNewObjects(0);
      loop.start();
    }, 1000);
  }, 1000);
};

let gameStarted = false;

const gameoverToMenu = () => {
  gameStarted = false;
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;
  inventory.paths = 9;

  oxCounterWrapper.style.width = 0;
  goatCounterWrapper.style.width = 0;
  fishCounterWrapper.style.width = 0;
  oxCounterWrapper.style.opacity = 0;
  goatCounterWrapper.style.opacity = 0;
  fishCounterWrapper.style.opacity = 0;
  oxCounter.innerText = 0;
  goatCounter.innerText = 0;
  fishCounter.innerText = 0;

  setTimeout(() => {
    goatFarms.length = 0;
    oxFarms.length = 0;
    people.length = 0;
    farms.length = 0;
    animals.length = 0;
    oxen.length = 0;
    goats.length = 0;
    fishes.length = 0;
    yurts.length = 0;
    paths.length = 0;
    ponds.length = 0;
    updateCount = 0;
    renderCount = 0;
    totalUpdateCount = 0;
    clearLayers();
    hideGameover();
    svgElement.style.transform = '';
    pathTilesIndicatorCount.innerText = inventory.paths;

    setTimeout(() => {
      spawnNewObjects(totalUpdateCount, gameStarted, 2000);
      showMenu(farms[0]);
      loop.start();
    }, 750);
  }, 500);
};

initUi();
initMenuBackground();
initGameover(startNewGame, gameoverToMenu);
init(null, { contextless: true });
initPointer();

const startGame = () => {
  svgElement.style.transition = 'transform 2s';
  svgElement.style.transform = 'rotate(0) scale(1) translate(0, 0)';
  pathTilesIndicatorCount.innerText = inventory.paths;
  scoreCounters.style.opacity = 1;
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
  blur: true, // Still update and render even if the page does not have focus
  update() {
    if (gameStarted) {
      spawnNewObjects(totalUpdateCount, gameStarted);

      if (totalUpdateCount === 50) {
        scoreCounters.style.opacity = 1;
      }

      if (totalUpdateCount === 100) {
        pathTilesIndicator.style.opacity = 1;
      }

      if (totalUpdateCount === 150) {
        clock.style.opacity = 1;
      }

      if (totalUpdateCount === 250) {
        pauseButton.style.opacity = 1;
      }

      if (totalUpdateCount % (720 * 12) === 0 && inventory.paths < 99) { // 720
        pathTilesIndicator.style.scale = 1.1;

        pathTilesIndicatorCount.innerText = '+9';

        setTimeout(() => pathTilesIndicatorCount.innerText = inventory.paths, 1300);

        for (let i = 0; i < 9; i++) {
          setTimeout(() => {
            if (inventory.paths < 99) {
              inventory.paths++;
              pathTilesIndicatorCount.innerText = inventory.paths;
            }
          },  1300 + 100 * i);
        }

        setTimeout(() => {
          pathTilesIndicator.style.scale = 1;
        }, 300);
      }

      // Updating this at 60FPS is a bit much but rotates are usually on the GPU anyway
      clockHand.style.transform = `rotate(${totalUpdateCount / 2}deg)`;
      switch (Math.floor(totalUpdateCount / 720 % 12)) {
        case 0: clockMonth.innerText = 'Jan'; break;
        case 1: clockMonth.innerText = 'Feb'; break;
        case 2: clockMonth.innerText = 'Mar'; break;
        case 3: clockMonth.innerText = 'Apr'; break;
        case 4: clockMonth.innerText = 'May'; break;
        case 5: clockMonth.innerText = 'Jun'; break;
        case 6: clockMonth.innerText = 'Jul'; break;
        case 7: clockMonth.innerText = 'Aug'; break;
        case 8: clockMonth.innerText = 'Sep'; break;
        case 9: clockMonth.innerText = 'Oct'; break;
        case 10: clockMonth.innerText = 'Nov'; break;
        case 11: clockMonth.innerText = 'Dec'; break;
      }
    }

    updateCount++;
    totalUpdateCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser FPS anyway
    /* eslint-disable default-case */
    switch (updateCount % 4) {
      case 0:
        // Update path grid data once every 4 updates (15 times per second) instead of
        // every single time pathfinding is updated which was 6000 time per second(?)
        updateGridData();
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
        fishCounterWrapper.style.opacity = 0;
        clock.style.opacity = 0;
        pathTilesIndicator.style.opacity = 0;
        pauseButton.style.opacity = 0;

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
        // pathTilesIndicatorCount.innerText = inventory.paths;
        // if (inventory.paths === 0) {
        //   pathTilesIndicatorCount.style.background = colors.red;
        //   pathTilesIndicatorCount.style.color = '#fff';
        // } else {
        //   pathTilesIndicatorCount.style.background = '#eee';
        //   pathTilesIndicatorCount.style.color = colors.ui;
        // }
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

const togglePause = () => {
  if (loop.isStopped) {
    loop.start();
    pauseSvgPath.setAttribute('d', 'M6 6 6 10M10 6 10 8 10 10');
    pauseSvgPath.style.transform = 'rotate(180deg)';
  } else {
    loop.stop();
    pauseSvgPath.setAttribute('d', 'M7 6 7 10M7 6 10 8 7 10');
    pauseSvgPath.style.transform = 'rotate(0)';
  }
}

pauseButton.addEventListener('click', togglePause);

document.addEventListener('keypress', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
    togglePause();

    // Simulate :active styles
    pauseButton.style.transform = 'scale(.95)';
    setTimeout(() => pauseButton.style.transform = '', 150);
  }
});

setTimeout(() => {
  loop.start();
}, 1000);
