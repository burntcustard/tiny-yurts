import { emojiGoat } from './goat-emoji';
import { emojiOx } from './ox-emoji';
import { emojiFish } from './fish-emoji';
import { oxen } from './ox';
import { goats } from './goat';
import { fishes } from './fish';
import { animals } from './animal';
import { yurts } from './yurt';
import { colors } from './colors';
import { menuBackground } from './menu-background';
import {
  scoreCounters, uiContainer, gridToggleButton, soundToggleButton, gridRedToggleButton,
} from './ui';
import { createElement } from './create-element';

const gameoverWrapper = createElement();
const gameoverHeader = createElement();
const gameoverText1 = createElement();
const gameoverText2 = createElement();
const gameoverText3 = createElement();
const gameoverButtons = createElement();
const restartButtonWrapper = createElement();
const restartButton = createElement('button');
const menuButtonWrapper = createElement();
const menuButton = createElement('button');
const oxEmojiWrapper = createElement();
const oxEmoji = emojiOx();
const goatEmojiWrapper = createElement();
const goatEmoji = emojiGoat();
const fishEmojiWrapper = createElement();
const fishEmoji = emojiFish();
const scoreWrapper = createElement();
export const toggleGameoverlayButton = createElement('button');

export const initGameover = (startNewGame, gameoverToMenu, toggleGameoverlay) => {
  gameoverWrapper.style.cssText = `
    position: absolute;
    inset: 0;
    padding: 10vmin;
    display: flex;
    flex-direction: column;
  `;
  gameoverWrapper.style.pointerEvents = 'none';
  gameoverWrapper.style.opacity = 0;

  gameoverHeader.style.cssText = `font-size: 72px; opacity: 0`;
  gameoverHeader.innerText = 'Game Over';

  gameoverText1.style.cssText = `margin-top: 48px; font-size: 24px; opacity:0`;
  gameoverText1.innerText = 'Too few people could tend to this farm in time.';

  gameoverText2.style.cssText = `margin-top: 16px; font-size: 24px; opacity: 0`;

  // 24px margin-top counteracts the underline in gameoverText2
  gameoverText3.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 24px;
    font-size: 24px;
  `;
  gameoverText3.style.opacity = 0;
  if (document.body.scrollHeight < 500) {
    gameoverText3.style.position = 'absolute';
    gameoverText3.style.bottom = '10vmin';
    gameoverText3.style.right = '10vmin';
  } else {
    gameoverText3.style.position = '';
    gameoverText3.style.bottom = '';
    gameoverText3.style.right = '';
  }
  addEventListener('resize', () => {
    if (document.body.scrollHeight < 500) {
      gameoverText3.style.position = 'absolute';
      gameoverText3.style.bottom = '10vmin';
      gameoverText3.style.right = '10vmin';
    } else {
      gameoverText3.style.position = '';
      gameoverText3.style.bottom = '';
      gameoverText3.style.right = '';
    }
  });

  oxEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 12px;line-height:24px;color:#fff;border-radius:64px;background:${colors.ui}`;
  goatEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 12px;line-height:24px;color:#fff;border-radius:64px;background:${colors.ui}`;
  fishEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 12px;line-height:24px;color:#fff;border-radius:64px;background:${colors.ui}`;
  scoreWrapper.style.cssText = `display:inline-flex;padding:6px 12px;line-height:24px;color:#fff;border-radius:64px;background:${colors.ui}`;
  oxEmoji.style.width = '24px';
  oxEmoji.style.height = '24px';
  goatEmoji.style.width = '24px';
  goatEmoji.style.height = '24px';
  fishEmoji.style.width = '24px';
  fishEmoji.style.height = '24px';

  menuButtonWrapper.style.opacity = 0;
  restartButtonWrapper.style.opacity = 0;
  menuButtonWrapper.append(menuButton);
  restartButtonWrapper.append(restartButton);
  restartButton.innerText = 'Restart';
  menuButton.innerText = 'Menu';

  restartButton.addEventListener('click', startNewGame);

  menuButton.addEventListener('click', gameoverToMenu);

  gameoverButtons.append(restartButtonWrapper, menuButtonWrapper);
  gameoverButtons.style.cssText = `gap: 16px; margin-top: 48px;`;
  if (document.body.scrollHeight < 500) {
    gameoverButtons.style.display = 'flex';
    gameoverButtons.style.position = 'absolute';
    gameoverButtons.style.bottom = '10vmin';
    gameoverButtons.style.left = '10vmin';
  } else {
    gameoverButtons.style.display = 'grid';
    gameoverButtons.style.position = '';
    gameoverButtons.style.bottom = '';
    gameoverButtons.style.left = '';
  }
  addEventListener('resize', () => {
    if (document.body.scrollHeight < 500) {
      gameoverButtons.style.display = 'flex';
      gameoverButtons.style.position = 'absolute';
      gameoverButtons.style.bottom = '10vmin';
      gameoverButtons.style.left = '10vmin';
    } else {
      gameoverButtons.style.display = 'grid';
      gameoverButtons.style.position = '';
      gameoverButtons.style.bottom = '';
      gameoverButtons.style.left = '';
    }
  });

  toggleGameoverlayButton.style.cssText = `position: absolute; top: 10vmin; right: 10vmin`;
  toggleGameoverlayButton.style.pointerEvents = 'none';
  toggleGameoverlayButton.style.opacity = 0;
  toggleGameoverlayButton.innerText = 'Overlay On/Off';
  toggleGameoverlayButton.addEventListener('click', toggleGameoverlay);

  gameoverWrapper.append(
    gameoverHeader,
    gameoverText1,
    gameoverText2,
    gameoverText3,
    gameoverButtons,
  );

  document.body.append(gameoverWrapper, toggleGameoverlayButton);
};

export const showGameover = () => {
  const score = yurts.length * 2 + animals.length;
  uiContainer.style.zIndex = '';

  if (score > localStorage.getItem('Tiny Yurts')) {
    localStorage.setItem('Tiny Yurts', score);
  }

  menuBackground.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`;
  menuBackground.style.transition = `opacity 2s 1s`;
  gameoverHeader.style.transition = `opacity .5s 2s`;
  gameoverText1.style.transition = `opacity .5s 2s`;
  gameoverText2.style.transition = `opacity .5s 2s`;
  gameoverText3.style.transition = `opacity .5s 2s`;
  restartButtonWrapper.style.transition = `opacity .5s 2.5s`;
  menuButtonWrapper.style.transition = `opacity .5s 3s`;
  toggleGameoverlayButton.style.transition = `all .2s, opacity .5s 3.5s`;

  oxEmojiWrapper.innerHTML = '';
  oxEmojiWrapper.append(oxEmoji, `×${oxen.length}`);
  goatEmojiWrapper.innerHTML = '';
  goatEmojiWrapper.append(goatEmoji, `×${goats.length}`);
  fishEmojiWrapper.innerHTML = '';
  fishEmojiWrapper.append(fishEmoji, `×${fishes.length}`);
  scoreWrapper.innerHTML = `Score:${score}`;

  const peopleCount = createElement('u');
  peopleCount.innerText = `${yurts.length * 2} settlers`;

  const animalsCount = createElement('u');
  animalsCount.innerText = `${animals.length} animals`;

  gameoverText2.innerHTML = '';
  gameoverText2.append(peopleCount, ' and ', animalsCount, ' lived in your camp.');

  gameoverText3.innerHTML = '';
  gameoverText3.append(
    oxEmojiWrapper,
    ' ',
    goatEmojiWrapper,
    ' ',
    fishEmojiWrapper,
    ' ',
    scoreWrapper,
  );

  soundToggleButton.style.transition = `all .2s`;
  gridRedToggleButton.style.transition = `all .2s`;
  gridToggleButton.style.transition = `all .2s`;
  soundToggleButton.style.opacity = 0;
  gridRedToggleButton.style.opacity = 0;
  gridToggleButton.style.opacity = 0;
  scoreCounters.style.opacity = 0;

  setTimeout(() => {
    toggleGameoverlayButton.style.pointerEvents = ''; // Is separate from the gameoverWrapper
    gameoverWrapper.style.pointerEvents = '';
    gameoverWrapper.style.opacity = 1;
    menuBackground.style.opacity = 1;
    gameoverHeader.style.opacity = 1;
    gameoverText1.style.opacity = 1;
    gameoverText2.style.opacity = 1;
    gameoverText3.style.opacity = 1;
    restartButtonWrapper.style.opacity = 1;
    menuButtonWrapper.style.opacity = 1;
    toggleGameoverlayButton.style.opacity = 1;
  });
};

export const hideGameover = () => {
  gameoverWrapper.style.transition = `opacity 1s 2s`;
  menuBackground.style.transition = `opacity 1s 1s`;
  gameoverHeader.style.transition = `opacity .3s .6s`;
  gameoverText1.style.transition = `opacity .3s .5s`;
  gameoverText2.style.transition = `opacity .3s .4s`;
  gameoverText3.style.transition = `opacity .3s .3s`;
  restartButtonWrapper.style.transition = `opacity .3s .2s`;
  menuButtonWrapper.style.transition = `opacity .3s .1s`;

  gameoverWrapper.style.pointerEvents = 'none';
  gameoverWrapper.style.opacity = 0;
  menuBackground.style.opacity = 0;
  gameoverHeader.style.opacity = 0;
  gameoverText1.style.opacity = 0;
  gameoverText2.style.opacity = 0;
  gameoverText3.style.opacity = 0;
  restartButtonWrapper.style.opacity = 0;
  menuButtonWrapper.style.opacity = 0;
};
