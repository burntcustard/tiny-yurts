import { GameLoop } from './modified-kontra/game-loop';
import {
  svgElement, gridWidth, gridHeight, boardOffsetX, boardOffsetY,
} from './svg';
import { initPointer } from './pointer';
import { oxFarms } from './ox-farm';
import { goatFarms } from './goat-farm';
import { fishFarms } from './fish-farm';
import { people } from './person';
import { inventory } from './inventory';
// We import a huge amount from UI, & should probably use more of it inside itself rather than here
import {
  // eslint-disable-next-line max-len
  initUi, scoreCounters, goatCounter, goatCounterWrapper, oxCounter, oxCounterWrapper, fishCounter, fishCounterWrapper, pathTilesIndicator, pathTilesIndicatorCount, clock, clockHand, clockMonth, pauseButton, pauseSvgPath, gridToggleButton, gridRedToggleButton, soundToggleButton, soundToggleTooltip, soundToggleSvgPathX, gridRedToggleTooltip, gridToggleTooltip,
} from './ui';
import { farms } from './farm';
import { svgPxToDisplayPx } from './cell';
import { spawnNewObjects } from './spawning';
import { animals } from './animal';
import { oxen } from './ox';
import { goats } from './goat';
import { fishes } from './fish';
import { ponds } from './pond';
import { yurts } from './yurt';
import { paths } from './path';
import { clearLayers } from './layers';
import { initMenuBackground } from './menu-background';
import {
  initGameover, showGameover, hideGameover, toggleGameoverlayButton,
} from './gameover';
import { initMenu, showMenu, hideMenu } from './menu';
import { updateGridData } from './find-route';
import {
  gridLockToggle, gridRedLockToggle, gridRedHide, gridRedState,
} from './grid-toggle';
import { colors } from './colors';
import { trees } from './tree';
import { initAudio, soundSetings, playSound } from './audio';

let updateCount = 0;
let renderCount = 0;
let totalUpdateCount = 0;
let gameOverlayHidden;
let lostFarmPosition;
let gameStarted = false;

const loop = GameLoop({
  update() {
    if (gameStarted) {
      spawnNewObjects(totalUpdateCount, gameStarted);

      // if (totalUpdateCount === 90) {
      //   gridRedToggleButton.style.opacity = 1;
      // }

      if (totalUpdateCount === 120) {
        scoreCounters.style.opacity = 1;
      }

      if (totalUpdateCount === 150) {
        pathTilesIndicator.style.opacity = 1;
      }

      if (totalUpdateCount === 180) {
        clock.style.opacity = 1;
      }

      if (totalUpdateCount === 210) {
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
          }, 1300 + 100 * i);
        }

        setTimeout(() => {
          pathTilesIndicator.style.scale = 1;
        }, 300);
      }

      // Updating this at 60FPS is a bit much but rotates are usually on the GPU anyway
      clockHand.style.transform = `rotate(${totalUpdateCount / 2}deg)`;
      // switch (Math.floor(totalUpdateCount / 720 % 12)) {
      //   case 0: clockMonth.innerText = 'Jan'; break;
      //   case 1: clockMonth.innerText = 'Feb'; break;
      //   case 2: clockMonth.innerText = 'Mar'; break;
      //   case 3: clockMonth.innerText = 'Apr'; break;
      //   case 4: clockMonth.innerText = 'May'; break;
      //   case 5: clockMonth.innerText = 'Jun'; break;
      //   case 6: clockMonth.innerText = 'Jul'; break;
      //   case 7: clockMonth.innerText = 'Aug'; break;
      //   case 8: clockMonth.innerText = 'Sep'; break;
      //   case 9: clockMonth.innerText = 'Oct'; break;
      //   case 10: clockMonth.innerText = 'Nov'; break;
      //   case 11: clockMonth.innerText = 'Dec'; break;
      // }
      // Converted to from switch to if () for better compression
      if (Math.floor((totalUpdateCount / 720) % 12) === 0) {
        clockMonth.innerText = 'Jan';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 1) {
        clockMonth.innerText = 'Feb';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 2) {
        clockMonth.innerText = 'Mar';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 3) {
        clockMonth.innerText = 'Apr';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 4) {
        clockMonth.innerText = 'May';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 5) {
        clockMonth.innerText = 'Jun';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 6) {
        clockMonth.innerText = 'Jul';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 7) {
        clockMonth.innerText = 'Aug';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 8) {
        clockMonth.innerText = 'Sep';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 9) {
        clockMonth.innerText = 'Oct';
      } else if (Math.floor((totalUpdateCount / 720) % 12) === 10) {
        clockMonth.innerText = 'Nov';
      } else {
        clockMonth.innerText = 'Dec';
      }
    }

    updateCount++;
    totalUpdateCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser FPS anyway
    /* eslint-disable default-case */
    // switch (updateCount % 4) {
    //   case 0:
    //     // Update path grid data once every 4 updates (15 times per second) instead of
    //     // every single time pathfinding is updated which was 6000 time per second(?)
    //     updateGridData();
    //     break;
    //   case 1:
    //     oxFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    //     break;
    //   case 2:
    //     goatFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    //     break;
    //   case 3:
    //     fishFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    //     break;
    // }
    // Converted to from switch to if () for better compression
    if (updateCount % 4 === 0) {
      updateGridData();
    } else if (updateCount % 4 === 1) {
      oxFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    } else if (updateCount % 4 === 2) {
      goatFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    } else { // 3
      fishFarms.forEach((farm) => farm.update(gameStarted, totalUpdateCount));
    }

    if (updateCount >= 60) updateCount = 0;

    farms.forEach((f) => {
      if (!f.isAlive) {
        gameStarted = false;
        loop.stop();

        lostFarmPosition = svgPxToDisplayPx(
          f.x - gridWidth / 2 - boardOffsetX + f.width / 2,
          f.y - gridHeight / 2 - boardOffsetY + f.height / 2,
        );

        svgElement.style.transition = `transform 2s ease-out .5s`;
        svgElement.style.transform = `rotate(-17deg) scale(2) translate(${-lostFarmPosition.x}px, ${-lostFarmPosition.y}px)`;

        oxCounterWrapper.style.opacity = 0;
        goatCounterWrapper.style.opacity = 0;
        fishCounterWrapper.style.opacity = 0;
        clock.style.opacity = 0;
        pathTilesIndicator.style.opacity = 0;
        pauseButton.style.opacity = 0;
        gridRedState.on = false;
        gridRedState.buttonShown = false;
        gridRedHide();

        updateCount = 0;
        totalUpdateCount = 0;
        renderCount = 0;
        // This isn't actually used for a while, so does end up defined.
        // It would still be good to sort it out in some way though...
        // eslint-disable-next-line no-use-before-define
        showGameover(startNewGame);
      }
    });

    people.forEach((p) => p.update());
  },
  render() {
    renderCount++;

    // Some things happen 15 times/s instead of 60.
    // E.g. because movement handled with CSS transitions will be done at browser FPS anyway
    // switch (renderCount % 4) {
    //   case 0:
    //     break;
    //   case 1:
    //     oxFarms.forEach((farm) => farm.render());
    //     break;
    //   case 2:
    //     goatFarms.forEach((farm) => farm.render());
    //     break;
    //   case 3:
    //     fishFarms.forEach((farm) => farm.render());
    //     break;
    // }
    // Converted to from switch to if () for better compression
    if (renderCount % 4 === 1) {
      oxFarms.forEach((farm) => farm.render());
    } else if (renderCount % 4 === 2) {
      goatFarms.forEach((farm) => farm.render());
    } else {
      fishFarms.forEach((farm) => farm.render());
    }

    if (renderCount >= 60) renderCount = 0;

    people.forEach((p) => p.render());
  },
});

const startNewGame = () => {
  // Had to wrap this all in a gameStarted check, because restart button still exists
  // (and has focus!) so could be "pressed" with space bar to re-restart
  if (!gameStarted && loop.isStopped) {
    gameStarted = true;

    svgElement.style.transition = `transform 2s`;
    svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;

    soundToggleButton.style.transition = `all .2s, width.5s 4s, opacity .5s 3s`;
    gridRedToggleButton.style.transition = `all .2s, width.5s 4s, opacity .5s 3s`;
    gridToggleButton.style.transition = `all .2s, width .5s 4s, opacity .5s 3s`;

    soundToggleTooltip.style.transition = `all .5s`;
    gridRedToggleTooltip.style.transition = `all .5s`;
    gridToggleTooltip.style.transition = `all .5s`;

    soundToggleButton.style.opacity = 1;
    gridRedToggleButton.style.opacity = 1;
    gridToggleButton.style.opacity = 1;

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

    toggleGameoverlayButton.style.opacity = 0;
    toggleGameoverlayButton.style.pointerEvents = 'none';
    toggleGameoverlayButton.style.transition = `all .2s, opacity .5s`;

    setTimeout(() => {
      goatFarms.length = 0;
      oxFarms.length = 0;
      fishFarms.length = 0;
      people.length = 0;
      farms.length = 0;
      animals.length = 0;
      oxen.length = 0;
      goats.length = 0;
      fishes.length = 0;
      yurts.length = 0;
      paths.length = 0;
      ponds.length = 0;
      trees.length = 0;
      updateCount = 1;
      totalUpdateCount = 1;
      renderCount = 1;
      inventory.paths = 18;
      pathTilesIndicatorCount.innerText = inventory.paths;
      clearLayers();
      hideGameover();
      svgElement.style.transform = '';

      setTimeout(() => {
        spawnNewObjects(0);
        loop.start();
      }, 1000);
    }, 1000);
  }
};

const gameoverToMenu = () => {
  gameStarted = false;

  svgElement.style.transition = `transform 2s`;
  svgElement.style.transform = `rotate(0) scale(2) translate(0, ${svgPxToDisplayPx(0, gridHeight).y / -2}px)`;

  inventory.paths = 18;

  oxCounterWrapper.style.width = 0;
  goatCounterWrapper.style.width = 0;
  fishCounterWrapper.style.width = 0;
  oxCounterWrapper.style.opacity = 0;
  goatCounterWrapper.style.opacity = 0;
  fishCounterWrapper.style.opacity = 0;
  oxCounter.innerText = 0;
  goatCounter.innerText = 0;
  fishCounter.innerText = 0;

  toggleGameoverlayButton.style.opacity = 0;
  toggleGameoverlayButton.style.pointerEvents = 'none';
  toggleGameoverlayButton.style.transition = `all .2s, opacity .5s`;

  soundToggleTooltip.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;
  gridRedToggleTooltip.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;
  gridToggleTooltip.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;
  soundToggleButton.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;
  gridRedToggleButton.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;
  gridToggleButton.style.transition = `all.2s,width.5s 4s,opacity.5s 4s`;

  soundToggleTooltip.style.width = '96px';
  gridRedToggleTooltip.style.width = '96px';
  gridToggleTooltip.style.width = '96px';
  soundToggleTooltip.style.opacity = 1;
  gridRedToggleTooltip.style.opacity = 1;
  gridToggleTooltip.style.opacity = 1;
  soundToggleButton.style.opacity = 1;
  gridRedToggleButton.style.opacity = 1;
  gridToggleButton.style.opacity = 1;

  setTimeout(() => {
    goatFarms.length = 0;
    oxFarms.length = 0;
    fishFarms.length = 0;
    people.length = 0;
    farms.length = 0;
    animals.length = 0;
    oxen.length = 0;
    goats.length = 0;
    fishes.length = 0;
    yurts.length = 0;
    paths.length = 0;
    ponds.length = 0;
    trees.length = 0;
    updateCount = 0;
    totalUpdateCount = 0;
    renderCount = 0;
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

const toggleGameoverlay = () => {
  if (gameOverlayHidden) {
    gameOverlayHidden = false;
    svgElement.style.transform = `rotate(-17deg) scale(2) translate(${-lostFarmPosition.x}px, ${-lostFarmPosition.y}px)`;
    showGameover();
  } else {
    gameOverlayHidden = true;
    svgElement.style.transform = '';
    hideGameover();
  }
};

initUi();
initMenuBackground();
initGameover(startNewGame, gameoverToMenu, toggleGameoverlay);
initPointer();

const startGame = () => {
  if (!gameStarted) {
    svgElement.style.transition = `transform 2s`;
    svgElement.style.transform = '';
    pathTilesIndicatorCount.innerText = inventory.paths;
    hideMenu();
    gameStarted = true;
    updateCount = 1;
    totalUpdateCount = 1;
    renderCount = 1;

    soundToggleTooltip.style.transition = `all.5s`;
    gridRedToggleTooltip.style.transition = `all.5s`;
    gridToggleTooltip.style.transition = `all.5s`;

    soundToggleButton.style.opacity = 1;
    gridRedToggleButton.style.opacity = 1;
    gridToggleButton.style.opacity = 1;
  }
};

// demoColors();
initMenu(startGame);
// spawnTrees();
spawnNewObjects(totalUpdateCount, 2500);

showMenu(farms[0], true);

const togglePause = () => {
  if (gameStarted && totalUpdateCount > 210) {
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
};

const toggleSound = () => {
  initAudio();

  if (soundSetings.on) {
    soundSetings.on = false;
    localStorage.setItem('Tiny Yurtss', false);
    soundToggleSvgPathX.setAttribute('d', 'M11 7Q10 8 9 9M9 7Q10 8 11 9');
    soundToggleSvgPathX.style.stroke = colors.red;
    soundToggleTooltip.innerHTML = 'Sound: <u>Off';
  } else {
    soundSetings.on = true;
    localStorage.setItem('Tiny Yurtss', true);
    soundToggleSvgPathX.setAttribute('d', 'M10 6Q12 8 10 10M10 6Q12 8 10 10');
    soundToggleSvgPathX.style.stroke = colors.ui;
    soundToggleTooltip.innerHTML = 'Sound: <u>On';
  }

  // This returns before playing if soundSettings.on === false
  // frequencyIndex, noteLength, playbackRate, pingyness, volume, lowpass, highpass
  playSound(30, 1, 1, 1, 0.3, 1000, 1000);
};

if (soundSetings.on) {
  soundToggleSvgPathX.setAttribute('d', 'M10 6Q12 8 10 10M10 6Q12 8 10 10');
  soundToggleSvgPathX.style.stroke = colors.ui;
  soundToggleTooltip.innerHTML = 'Sound: <u>On';
} else {
  soundToggleSvgPathX.setAttribute('d', 'M11 7Q10 8 9 9M9 7Q10 8 11 9');
  soundToggleSvgPathX.style.stroke = colors.red;
  soundToggleTooltip.innerHTML = 'Sound: <u>Off';
}

pauseButton.addEventListener('click', togglePause);
gridRedToggleButton.addEventListener('click', gridRedLockToggle);
gridToggleButton.addEventListener('click', gridLockToggle);
soundToggleButton.addEventListener('click', toggleSound);
soundToggleTooltip.addEventListener('click', () => soundToggleButton.click());
gridRedToggleTooltip.addEventListener('click', () => gridRedToggleButton.click());
gridToggleTooltip.addEventListener('click', () => gridToggleButton.click());

document.addEventListener('keypress', (event) => {
  if (event.key === ' ') {
    // Prevent double-toggling by having the button be focused when pressing space
    if (event.target !== pauseButton) {
      togglePause();
    }

    // Simulate :active styles
    pauseButton.style.transform = 'scale(.95)';
    setTimeout(() => pauseButton.style.transform = '', 150);
  }

  // initAudio();

  // if (event.key === 'o') playWarnNote(colors.ox);
  // if (event.key === 'g') playWarnNote(colors.goat);
  // if (event.key === 'f') playWarnNote(colors.fish);
  // if (event.key === 'p') playPathPlacementNote();
  // if (event.key === 'r') playPathDeleteNote();
  // if (event.key === 't') playTreeDeleteNote();
  // if (event.key === 'y') playYurtSpawnNote();
  // if (event.key === 'n') playOutOfPathsNote(); // 'n'o paths
});

setTimeout(() => {
  loop.start();
}, 1000);
