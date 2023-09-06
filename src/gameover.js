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
import { scoreCounters } from './ui';
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

export const initGameover = (startNewGame, gameoverToMenu) => {
  gameoverWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0';

  gameoverHeader.style.cssText = 'font-size:72px;opacity:0';
  gameoverHeader.innerText = 'Game Over';

  gameoverText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0';
  gameoverText1.innerText = 'Too few people could tend to this farm in time.';

  gameoverText2.style.cssText = 'margin-top:16px;font-size:24px;opacity:0';

  // 24px margin-top counteracts the underline in gameoverText2
  gameoverText3.style.cssText = 'margin-top:24px;font-size:24px;';

  oxEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;background:${colors.ui}`;
  goatEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;background:${colors.ui}`;
  fishEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;background:${colors.ui}`;
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
  restartButton.className = 'menu';
  menuButton.className = 'menu';
  restartButton.innerText = 'Restart';
  menuButton.innerText = 'Menu';

  restartButton.addEventListener('click', startNewGame);

  menuButton.addEventListener('click', gameoverToMenu);

  gameoverButtons.append(restartButtonWrapper, menuButtonWrapper);
  gameoverButtons.style.cssText = 'display:grid;gap:16px;margin-top:48px';

  gameoverWrapper.append(
    gameoverHeader,
    gameoverText1,
    gameoverText2,
    gameoverText3,
    gameoverButtons,
  );

  document.body.append(gameoverWrapper);
};

export const showGameover = () => {
  menuBackground.style.clipPath = 'polygon(0 0,100% 0, 100% 100%, 0 100%)';
  menuBackground.style.transition = 'opacity 2s 1s';
  gameoverHeader.style.transition = 'opacity 1s 2s';
  gameoverText1.style.transition = 'opacity 1s 2s';
  gameoverText2.style.transition = 'opacity 1s 3s';
  oxEmojiWrapper.style.transition = 'opacity 1s 3.2s';
  goatEmojiWrapper.style.transition = 'opacity 1s 3.6s';
  fishEmojiWrapper.style.transition = 'opacity 1s 3.8s';
  restartButtonWrapper.style.transition = 'opacity 1s 5s';
  menuButtonWrapper.style.transition = 'opacity 1s 5.2s';

  oxEmojiWrapper.innerHTML = '';
  oxEmojiWrapper.append(oxEmoji, `×${oxen.length}`);
  goatEmojiWrapper.innerHTML = '';
  goatEmojiWrapper.append(goatEmoji, `×${goats.length}`);
  fishEmojiWrapper.innerHTML = '';
  fishEmojiWrapper.append(fishEmoji, `×${fishes.length}`);

  const peopleCount = createElement('u');
  peopleCount.innerText = `${yurts.length * 2} settlers`;

  const animalsCount = createElement('u');
  animalsCount.innerText = `${animals.length} animals`;

  gameoverText2.innerHTML = '';
  gameoverText2.append(peopleCount, ' and ', animalsCount, ' lived in your camp.');

  gameoverText3.innerHTML = '';
  gameoverText3.append(oxEmojiWrapper, ' ', goatEmojiWrapper, ' ', fishEmojiWrapper);

  scoreCounters.style.opacity = 0;

  setTimeout(() => {
    gameoverWrapper.style.pointerEvents = '';
    gameoverWrapper.style.opacity = 1;
    menuBackground.style.opacity = 1;
    gameoverHeader.style.opacity = 1;
    gameoverText1.style.opacity = 1;
    gameoverText2.style.opacity = 1;
    oxEmojiWrapper.style.opacity = 1;
    goatEmojiWrapper.style.opacity = 1;
    fishEmojiWrapper.style.opacity = 1;
    restartButtonWrapper.style.opacity = 1;
    menuButtonWrapper.style.opacity = 1;
  });
};

export const hideGameover = () => {
  gameoverWrapper.style.transition = 'opacity 1s 2s';
  menuBackground.style.transition = 'opacity 1s 1s';
  gameoverHeader.style.transition = 'opacity.3s.6s';
  gameoverText1.style.transition = 'opacity.3s.5s';
  gameoverText2.style.transition = 'opacity.3s.4s';
  oxEmojiWrapper.style.transition = 'opacity.3s.3s';
  goatEmojiWrapper.style.transition = 'opacity.3s.2s';
  fishEmojiWrapper.style.transition = 'opacity.3s.2s';
  restartButtonWrapper.style.transition = 'opacity.3s.1s';
  menuButtonWrapper.style.transition = 'opacity.3s 0s';

  gameoverWrapper.style.pointerEvents = 'none';
  gameoverWrapper.style.opacity = 0;
  menuBackground.style.opacity = 0;
  gameoverHeader.style.opacity = 0;
  gameoverText1.style.opacity = 0;
  gameoverText2.style.opacity = 0;
  oxEmojiWrapper.style.opacity = 0;
  goatEmojiWrapper.style.opacity = 0;
  fishEmojiWrapper.style.opacity = 0;
  restartButtonWrapper.style.opacity = 0;
  menuButtonWrapper.style.opacity = 0;
};
