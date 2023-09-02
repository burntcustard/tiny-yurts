import { svgElement, boardOffsetX, boardOffsetY, gridWidth, gridHeight } from './svg';
import { svgPxToDisplayPx } from './cell';
import { menuBackground } from './menu-background';

const menuWrapper = document.createElement('div');
const menuHeader = document.createElement('div');
const menuText1 = document.createElement('div');
const menuButtons = document.createElement('div');
const startButtonWrapper = document.createElement('div');
const startButton = document.createElement('button');

export const initMenu = (startGame) => {
  menuWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;';

  // This has to be a sibling element, behind the gameoverScreen, not a child of it,
  // so that the backdrop-filter can transition properly
  menuBackground.style.clipPath = 'polygon(0 0, calc(20dvw + 400px) 0, calc(20dvw + 350px) 100%, 0 100%)';

  menuHeader.style.cssText = 'font-size:72px;opacity:0;';
  menuHeader.innerText = 'Tiny Yurts';

  menuText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0';
  menuText1.innerText = 'A game about ...';

  startButton.className = 'menu';
  startButton.innerText = 'Start';
  startButton.addEventListener('click', () => {
    startGame();
  });
  startButtonWrapper.style.opacity = 0;
  menuButtons.append(startButtonWrapper);
  menuButtons.style.cssText = 'display:grid;gap:16px;margin-top:48px';
  startButtonWrapper.append(startButton);

  menuWrapper.append(menuHeader, menuText1, menuButtons);

  document.body.append(menuWrapper);
};

export const showMenu = (focus, firstTime) => {
  menuBackground.style.clipPath = 'polygon(0 0, calc(20dvw + 400px) 0, calc(20dvw + 350px) 100%, 0 100%)';
  menuBackground.style.transition = 'clip-path 1s, opacity 2s';
  menuHeader.style.transition = 'opacity .5s 1s';
  menuText1.style.transition = 'opacity .5s 1.2s';
  startButtonWrapper.style.transition = 'opacity .5s 1.4s';

  // First time the game is loaded, the menu background needs to be fast
  if (firstTime) {
    menuBackground.style.transition = 'opacity 0s';
    menuHeader.style.transition = 'opacity .5s .4s';
    menuText1.style.transition = 'opacity .5s .6s';
    startButtonWrapper.style.transition = 'opacity .5s .8s';
  }

  const farmPxPosition = svgPxToDisplayPx(
    focus.x - gridWidth / 2 - boardOffsetX + focus.width / 2,
    focus.y - gridHeight / 2 - boardOffsetY + focus.height / 2,
  );
  const xOffset = window.innerWidth / 4; // TODO: Calculate properly?
  svgElement.style.transition = '';
  svgElement.style.transform = `translate(${xOffset}px, 0) rotate(-17deg) scale(2) translate(${-farmPxPosition.x}px, ${-farmPxPosition.y}px)`;

  menuWrapper.style.pointerEvents = '';

  menuBackground.style.opacity = 1;
  menuHeader.style.opacity = 1;
  menuText1.style.opacity = 1;
  startButtonWrapper.style.opacity = 1;
};

export const hideMenu = () => {
  menuWrapper.style.pointerEvents = 'none';

  menuBackground.style.transition =     'opacity 1s.5s';
  menuHeader.style.transition =         'opacity.3s.3s';
  menuText1.style.transition =          'opacity.3s.2s';
  startButtonWrapper.style.transition = 'opacity.3s.1s';

  menuBackground.style.opacity = 0;
  startButtonWrapper.style.opacity = 0;
  menuText1.style.opacity = 0;
  menuHeader.style.opacity = 0;
};
