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
const gameoverButtons = document.createElement('div');
const restartButton = document.createElement('button');
const menuButton = document.createElement('button');
const oxEmojiWrapper = document.createElement('div');
const oxEmoji = emojiOx();
const goatEmojiWrapper = document.createElement('div');
const goatEmoji = emojiGoat();

export const initGameover = (startNewGame, gameoverToMenu) => {
  gameoverWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0';

  // This has to be a sibling element, behind the gameoverScreen, not a child of it,
  // so that the backdrop-filter can transition properly
  gameoverBackground.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;background:#fff0;';
  gameoverBackground.style.backdropFilter = 'blur(8px)';

  gameoverHeader.style.cssText = 'font-size:72px;opacity:0';
  gameoverHeader.innerText = 'Game Over';

  gameoverText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0';
  gameoverText1.innerText = 'Too few people could tend to this farm in time.';

  gameoverText2.style.cssText = 'margin-top:16px;font-size:24px;opacity:0';

  // 24px margin-top counteracts the underline in gameoverText2
  gameoverText3.style.cssText = 'margin-top:24px;font-size:24px;';

  oxEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;background:${colors.ui}`;
  oxEmoji.style.width = '24px';
  oxEmoji.style.height = '24px';

  goatEmojiWrapper.style.cssText = `display:inline-flex;padding:6px 10px;line-height:24px;color:#fff;border-radius:24px;opacity:0;background:${colors.ui}`;
  goatEmoji.style.width = '24px';
  goatEmoji.style.height = '24px';

  restartButton.style.cssText = menuButton.style.cssText = 'margin-top:48px;padding:0 20px;font-size:32px;height:56px;border-radius:48px;background:#fff;width:unset;aspect-ratio:unset;opacity:0;';
  menuButton.style.marginTop = '16px';
  restartButton.innerText = 'Restart';
  menuButton.innerText = 'Menu';

  restartButton.addEventListener('click', startNewGame);

  menuButton.addEventListener('click', gameoverToMenu);

  gameoverButtons.append(restartButton, menuButton);

  gameoverWrapper.append(gameoverHeader, gameoverText1, gameoverText2, gameoverText3, gameoverButtons);

  document.body.append(gameoverBackground, gameoverWrapper);
}

export const showGameover = () => {
  gameoverBackground.style.transition =   'all 2s 1s';
  gameoverHeader.style.transition =   'opacity 1s 2s';
  gameoverText1.style.transition =    'opacity 1s 3s';
  gameoverText2.style.transition =    'opacity 1s 4s';
  oxEmojiWrapper.style.transition =   'opacity 1s 5s';
  goatEmojiWrapper.style.transition = 'opacity 1s 5.5s';
  restartButton.style.transition =    'opacity 1s 6s';
  menuButton.style.transition =       'opacity 1s 6.5s';

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
    oxEmojiWrapper.style.opacity = 1;
    goatEmojiWrapper.style.opacity = 1;
    restartButton.style.opacity = 1;
    menuButton.style.opacity = 1;
  });
};

export const hideGameover = () => {
  gameoverWrapper.style.transition = 'opacity 1s 2s';
  gameoverBackground.style.transition =   'all 1s 1s';
  gameoverHeader.style.transition =   'opacity.3s.6s';
  gameoverText1.style.transition =    'opacity.3s.5s';
  gameoverText2.style.transition =    'opacity.3s.4s';
  oxEmojiWrapper.style.transition =   'opacity.3s.3s';
  goatEmojiWrapper.style.transition = 'opacity.3s.2s';
  restartButton.style.transition =    'opacity.3s.1s';
  menuButton.style.transition =       'opacity.3s 0s';

  setTimeout(() => {
    gameoverWrapper.style.pointerEvents = 'none';
    gameoverWrapper.style.opacity = 0;
    gameoverBackground.style.backdropFilter = 'blur(0)';
    gameoverBackground.style.background = '#fff0';
    gameoverBackground.style.opacity = 0;
    gameoverHeader.style.opacity = 0;
    gameoverText1.style.opacity = 0;
    gameoverText2.style.opacity = 0;
    oxEmojiWrapper.style.opacity = 0;
    goatEmojiWrapper.style.opacity = 0;
    restartButton.style.opacity = 0;
    menuButton.style.opacity = 0;
  });
};
