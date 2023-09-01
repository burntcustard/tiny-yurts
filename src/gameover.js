import { emojiGoat } from './goat-emoji';
import { emojiOx } from './ox-emoji';
import { goats } from './goat';
import { oxen } from './ox';
import { colors } from './colors';

const gameoverWrapper = document.createElement('div');
const gameoverBackground = document.createElement('div');
const gameoverHeader = document.createElement('div');
const gameoverText1 = document.createElement('div');
const gameoverText2 = document.createElement('div');
const gameoverText3 = document.createElement('div');
const gameoverTotal = document.createElement('span');
const gameoverButtons = document.createElement('div');

export const initGameover = () => {
  gameoverWrapper.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;transition:opacity 2s';

  // This has to be a sibling element, behind the gameoverScreen, not a child of it,
  // so that the backdrop-filter can transition properly
  gameoverBackground.style.cssText = 'position:absolute;inset:0;padding:10dvw;pointer-events:none;opacity:0;background:#fff0;';
  gameoverBackground.style.transition = 'all 2s 1s';
  gameoverBackground.style.backdropFilter = 'blur(8px)';

  gameoverHeader.style.cssText = 'font-size:72px;opacity:0;transition:opacity 1s 2s';
  gameoverHeader.innerText = 'Game Over';

  gameoverText1.style.cssText = 'margin-top:48px;font-size:24px;opacity:0;transition:opacity 1s 3s;';

  gameoverText2.style.cssText = 'margin-top:16px;font-size:24px;opacity:0;transition:opacity 1s 4s;';

  gameoverText3.style.cssText = 'margin-top:16px;font-size:24px;opacity:0;transition:opacity 1s 6s;';

  gameoverTotal.style.cssText = 'font-size:32px;opacity:0;transition:opacity 1s 5s';

  gameoverText2.append(gameoverTotal);

  gameoverButtons.style.cssText = 'opacity:0;transition:opacity 1s 8s;';
  const restartButton = document.createElement('button');
  const menuButton = document.createElement('button');
  restartButton.style.cssText = menuButton.style.cssText = 'margin-top:48px;padding:0 20px;font-size:32px;height:56px;border-radius:48px;background:#fff;width:unset;aspect-ratio:unset';
  menuButton.style.marginTop = '16px';
  restartButton.innerText = 'Restart';
  menuButton.innerText = 'Main menu';
  gameoverButtons.append(restartButton, menuButton);

  gameoverWrapper.append(gameoverHeader, gameoverText1, gameoverText2, gameoverText3, gameoverButtons);

  document.body.append(gameoverBackground, gameoverWrapper);
}

export const showGameover = () => {
  gameoverBackground.style.willChange = 'backdrop-filter, opacity, background';

  const oxEmojiWrapper = document.createElement('div');
  oxEmojiWrapper.style.cssText = `display:inline-flex;padding:4px 10px;background:${colors.ui};color:#fff;border-radius:24px;opacity:0;transition:opacity 1s 6s;`;
  const oxEmoji = emojiOx();
  oxEmoji.style.width = '24px';
  oxEmoji.style.height = '24px';
  oxEmoji.style.transform = 'translate(0, 2px)';
  oxEmojiWrapper.append(oxEmoji, `×${oxen.length}`);

  const goatEmojiWrapper = document.createElement('div');
  goatEmojiWrapper.style.cssText = `display:inline-flex;padding:4px 10px;background:${colors.ui};color:#fff;border-radius:24px;opacity:0;transition:opacity 1s 7s;`;
  const goatEmoji = emojiGoat();
  goatEmoji.style.width = '24px';
  goatEmoji.style.height = '24px';
  goatEmoji.style.transform = 'translate(0, 2px)';
  goatEmojiWrapper.append(goatEmoji, `×${goats.length}`);

  gameoverTotal.innerText = `${oxen.length + goats.length}`;

  gameoverText1.append('Too few people could reach this farm in time.');

  gameoverText2.append('Score: ', gameoverTotal);

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
}
