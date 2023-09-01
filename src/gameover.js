import { emojiGoat } from './goat-emoji';
import { emojiOx } from './ox-emoji';
import { goats } from './goat';
import { oxen } from './ox';
import { animals } from './animal';
import { yurts } from './yurt';
import { colors } from './colors';

const gameoverWrapper = document.createElement('div');
const gameoverBackground = document.createElement('div');
const gameoverHeader = document.createElement('div');
const gameoverText1 = document.createElement('div');
const gameoverText2 = document.createElement('div');
const gameoverText3 = document.createElement('div');
const gameoverTotal = document.createElement('span');
const gameoverButtons = document.createElement('div');
const oxEmojiWrapper = document.createElement('div');
const oxEmoji = emojiOx();
const goatEmojiWrapper = document.createElement('div');
const goatEmoji = emojiGoat();

export const initGameover = (startNewGame) => {
  gameoverWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;transition:opacity 2s';

  // This has to be a sibling element, behind the gameoverScreen, not a child of it,
  // so that the backdrop-filter can transition properly
  gameoverBackground.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;background:#fff0;';
  gameoverBackground.style.transition = 'all 2s 1s';
  gameoverBackground.style.backdropFilter = 'blur(8px)';

  gameoverHeader.style.cssText = 'font-size:72px;opacity:0;transition:opacity 1s 2s';
  gameoverHeader.innerText = 'Game Over';

  gameoverText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0;transition:opacity 1s 3s;';
  gameoverText1.innerText = 'Too few people could tend to this farm in time.';

  gameoverText2.style.cssText = 'margin-top:16px;font-size:24px;opacity:0;transition:opacity 1s 4s;';

  // 24px margin-top counteracts the underline in gameoverText2
  gameoverText3.style.cssText = 'margin-top:24px;font-size:24px;opacity:0;transition:opacity 1s 6s;';

  oxEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;transition:opacity 1s 6s;background:${colors.ui}`;
  oxEmoji.style.width = '24px';
  oxEmoji.style.height = '24px';

  goatEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;transition:opacity 1s 6.5s;background:${colors.ui}`;
  goatEmoji.style.width = '24px';
  goatEmoji.style.height = '24px';

  gameoverTotal.style.cssText = 'font-size:32px;opacity:0;transition:opacity 1s 5s';

  gameoverText2.append(gameoverTotal);

  gameoverButtons.style.cssText = 'opacity:0;transition:opacity 1s 8s;';
  const restartButton = document.createElement('button');
  const menuButton = document.createElement('button');
  restartButton.style.cssText = menuButton.style.cssText = 'margin-top:48px;padding:0 20px;font-size:32px;height:56px;border-radius:48px;background:#fff;width:unset;aspect-ratio:unset';
  menuButton.style.marginTop = '16px';
  restartButton.innerText = 'Restart';
  menuButton.innerText = 'Menu';
  restartButton.addEventListener('click', () => {
    startNewGame();
  });
  gameoverButtons.append(restartButton, menuButton);

  gameoverWrapper.append(gameoverHeader, gameoverText1, gameoverText2, gameoverText3, gameoverButtons);

  document.body.append(gameoverBackground, gameoverWrapper);
}

export const showGameover = () => {
  oxEmojiWrapper.innerHTML = '';
  oxEmojiWrapper.append(oxEmoji, `×${oxen.length}`);
  goatEmojiWrapper.innerHTML = '';
  goatEmojiWrapper.append(goatEmoji, `×${goats.length}`);

  const peopleCount = document.createElement('u');
  peopleCount.innerText = `${yurts.length * 2} settlers`;

  const animalsCount = document.createElement('u');
  animalsCount.innerText = `${animals.length} animals`;

  gameoverText2.innerHTML = '';
  gameoverText2.append(peopleCount, ' and ', animalsCount, ' lived in your camp.');

  gameoverText3.innerHTML = '';
  gameoverText3.append(oxEmojiWrapper, ' ' , goatEmojiWrapper);

  setTimeout(() => {
    gameoverWrapper.style.pointerEvents = '';
    gameoverWrapper.style.opacity = 1;
    gameoverBackground.style.backdropFilter = 'blur(8px)';
    gameoverBackground.style.background = '#fffb';
    gameoverBackground.style.opacity = 1;
    gameoverHeader.style.opacity = 1;
    gameoverText1.style.opacity = 1;
    gameoverText2.style.opacity = 1;
    gameoverText3.style.opacity = 1;
    oxEmojiWrapper.style.opacity = 1;
    goatEmojiWrapper.style.opacity = 1;
    gameoverTotal.style.opacity = 1;
    gameoverButtons.style.opacity = 1;
  });
};

export const hideGameover = () => {
  setTimeout(() => {
    gameoverWrapper.style.pointerEvents = 'none';
    gameoverWrapper.style.opacity = 0;
    gameoverBackground.style.backdropFilter = 'blur(0)';
    gameoverBackground.style.background = '#fff0';
    gameoverBackground.style.opacity = 0;
    gameoverHeader.style.opacity = 0;
    gameoverText1.style.opacity = 0;
    gameoverText2.style.opacity = 0;
    gameoverText3.style.opacity = 0;
    oxEmojiWrapper.style.opacity = 0;
    goatEmojiWrapper.style.opacity = 0;
    gameoverTotal.style.opacity = 0;
    gameoverButtons.style.opacity = 0;
  });
};
