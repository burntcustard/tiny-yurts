import { colors } from './colors';
import { svgElement, boardOffsetX, boardOffsetY, gridWidth, gridHeight } from './svg';
import { svgPxToDisplayPx } from './cell';

const menuWrapper = document.createElement('div');
const menuBackground = document.createElement('div');
const menuHeader = document.createElement('div');
const menuText1 = document.createElement('div');
const menuButtons = document.createElement('div');
const startButton = document.createElement('button');

export const initMenu = (startGame) => {
  menuWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;';

  // This has to be a sibling element, behind the gameoverScreen, not a child of it,
  // so that the backdrop-filter can transition properly
  menuBackground.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;background:#fff0;';
  menuBackground.style.clipPath = 'polygon(0 0, calc(20dvw + 400px) 0, calc(20dvw + 350px) 100%, 0 100%)';
  menuBackground.style.backdropFilter = 'blur(8px)';

  menuHeader.style.cssText = 'font-size:72px;opacity:0;';
  menuHeader.innerText = 'Tiny Yurts';

  menuText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0';
  menuText1.innerText = 'A game about ...';

  startButton.style.cssText = 'margin-top:48px;padding:0 20px;font-size:32px;height:56px;border-radius:48px;background:#fff;width:unset;aspect-ratio:unset;opacity:0;';
  startButton.innerText = 'Start';
  // menuButton.innerText = 'Menu';
  startButton.addEventListener('click', () => {
    startGame();
  });
  menuButtons.append(startButton);

  menuWrapper.append(menuHeader, menuText1, menuButtons);

  document.body.append(menuBackground, menuWrapper);
};

export const showMenu = (focus, firstTime) => {
  menuBackground.style.transition = 'opacity 2s';
  menuHeader.style.transition = 'opacity 1s 1s';
  menuText1.style.transition = 'opacity 1s 1.5s';
  startButton.style.transition = 'opacity 1s 2s';

  // First time the game is loaded, the menu background needs to be fast
  if (firstTime) {
    menuBackground.style.transition = 'opacity .5s';
    menuHeader.style.transition = 'opacity 1s .5s';
    menuText1.style.transition = 'opacity 1s 1s';
    startButton.style.transition = 'opacity 1s 1.5s';
  }

  const farmPxPosition = svgPxToDisplayPx(
    focus.x - gridWidth / 2 - boardOffsetX + focus.width / 2,
    focus.y - gridHeight / 2 - boardOffsetY + focus.height / 2,
  );
  const xOffset = window.innerWidth / 4; // TODO: Calculate properly?
  svgElement.style.transition = '';
  svgElement.style.transform = `translate(${xOffset}px, 0) rotate(-17deg) scale(2) translate(${-farmPxPosition.x}px, ${-farmPxPosition.y}px)`;

  menuWrapper.style.pointerEvents = '';
  menuBackground.style.backdropFilter = 'blur(8px)';
  menuBackground.style.background = '#fffb';
  menuBackground.style.opacity = 1;
  menuHeader.style.opacity = 1;
  menuText1.style.opacity = 1;
  startButton.style.opacity = 1;
};

export const hideMenu = () => {
  menuBackground.style.transition = 'all 1s .5s';
  menuBackground.style.backdropFilter = 'blur(0)';
  menuBackground.style.background = '#fff0';
  menuWrapper.style.pointerEvents = 'none';

  menuHeader.style.transition = 'opacity.3s.3s';
  menuText1.style.transition = 'opacity.3s.2s';
  startButton.style.transition = 'opacity.3s.1s';

  menuBackground.style.opacity = 0;
  menuBackground.style.opacity = 0;
  startButton.style.opacity = 0;
  menuText1.style.opacity = 0;
  menuHeader.style.opacity = 0;
};
