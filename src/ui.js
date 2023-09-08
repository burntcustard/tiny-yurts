import { createSvgElement } from './svg-utils';
import { emojiOx } from './ox-emoji';
import { emojiGoat } from './goat-emoji';
import { emojiFish } from './fish-emoji';
import { colors } from './colors';
import { createElement } from './create-element';

// Animal score counters (for incrementing) and their wrappers (for show/hiding)
export const oxCounterWrapper = createElement();
export const oxCounter = createElement();
export const goatCounterWrapper = createElement();
export const goatCounter = createElement();
export const fishCounterWrapper = createElement();
export const fishCounter = createElement();

export const scoreCounters = createElement();

export const clock = createElement();
export const clockMonth = createElement();

export const pathTilesIndicator = createElement();
export const pathTilesIndicatorCount = createElement();

export const pauseButton = createElement('button');
export const pauseSvgPath = createSvgElement('path');

// Odd one out because can't put divs in an svg
export const clockHand = createSvgElement('path');

export const initUi = () => {
  // TODO: Move elsewhre and minify
  const styles = createElement('style');
  styles.innerText = `
    body {
      position: relative;
      font-family: system-ui;
      font-weight: 700;
      color: #443;
      margin: 0;
      width: 100vw;
      height: 100vh;
    }
    button {
      font-weight: 700;
      font-family: system-ui;
      border: none;
      padding: 0 20px;
      font-size: 32px;
      height: 56px;
      border-radius: 48px;
      background: #fff;
      box-shadow: 0 0 0 1px ${colors.shade};
      transition: all .2s;
    }
    button:hover {
      box-shadow: 4px 4px 0 1px ${colors.shade};
    }
    button:active {
      box-shadow: 0 0 0 1px ${colors.shade};
      transform: scale(.95);
    }
  `;
  document.head.append(styles);

  // Add HTML UI elements (?)
  const uiContainer = createElement();
  uiContainer.style.cssText = 'position:absolute;inset:0;display:grid;overflow:hidden;pointer-events:none;';
  document.body.append(uiContainer);

  scoreCounters.style.cssText = 'display:flex;position:absolute;top:16px;left:16px;';
  scoreCounters.style.trasition = 'opacity 1s';
  scoreCounters.style.opacity = 0;

  oxCounterWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s';
  const oxCounterEmoji = emojiOx();
  oxCounterWrapper.style.width = 0;
  oxCounterWrapper.style.opacity = 0;
  oxCounterEmoji.style.width = '48px';
  oxCounterEmoji.style.height = '48px';
  oxCounterWrapper.append(oxCounterEmoji, oxCounter);

  goatCounterWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s';
  const goatCounterEmoji = emojiGoat();
  goatCounterWrapper.style.width = 0;
  goatCounterWrapper.style.opacity = 0;
  goatCounterEmoji.style.width = '48px';
  goatCounterEmoji.style.height = '48px';
  goatCounterWrapper.append(goatCounterEmoji, goatCounter);

  fishCounterWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s';
  const fishCounterEmoji = emojiFish();
  fishCounterWrapper.style.width = 0;
  fishCounterWrapper.style.opacity = 0;
  fishCounterEmoji.style.width = '48px';
  fishCounterEmoji.style.height = '48px';
  fishCounterWrapper.append(fishCounterEmoji, fishCounter);

  scoreCounters.append(oxCounterWrapper, goatCounterWrapper, fishCounterWrapper);

  clock.style.cssText = `
    position: absolute;
    top: 16px;
    right: 16px;
    display: grid;
    place-items: center;
    border-radius: 64px;
    background: ${colors.ui}
  `;
  clock.style.width = '80px';
  clock.style.height = '80px';
  clock.style.opacity = 0;
  clock.style.transition = 'opacity 1s';

  const clockSvg = createSvgElement('svg');
  clockSvg.setAttribute('stroke-linejoin', 'round');
  clockSvg.setAttribute('stroke-linecap', 'round');
  clockSvg.setAttribute('viewBox', '0 0 16 16');
  clockSvg.style.width = '80px';
  clockSvg.style.height = '80px';

  for (let i = 75; i < 350; i += 25) {
    const dot = createSvgElement('path');
    dot.setAttribute('fill', 'none');
    dot.setAttribute('stroke', '#eee');
    dot.setAttribute('transform-origin', 'center');
    dot.setAttribute('d', 'm8 14.5v0');
    dot.style.transform = `rotate(${i}grad)`;
    clockSvg.append(dot);
  }

  clockHand.setAttribute('stroke', '#eee');
  clockHand.setAttribute('transform-origin', 'center');
  clockHand.setAttribute('d', 'm8 4v4');
  clockSvg.append(clockHand);

  clockMonth.style.cssText = 'position:absolute;bottom:8px;color:#eee';

  clock.append(clockSvg, clockMonth);

  pathTilesIndicator.style.cssText = `
    position: absolute;
    display: grid;
    place-items: center;
    place-self: center;
    bottom: 20px;
    margin: 0 auto;
    border-radius: 20px;
    background: ${colors.ui};
  `;
  // left: 20px;
  if (screen.height * 2 < screen.width) {
    pathTilesIndicator.style.left = '20px';
  }
  pathTilesIndicator.style.transform = 'rotate(-45deg)';
  pathTilesIndicator.style.opacity = 0;
  pathTilesIndicator.style.transition = 'scale.4s cubic-bezier(.5,2,.5,1), opacity 1s';
  pathTilesIndicator.style.width = '72px';
  pathTilesIndicator.style.height = '72px';
  pathTilesIndicatorCount.style.cssText = `
    display: grid;
    place-items: center;
    position: absolute;
    border-radius: 64px;
    border: 6px solid ${colors.ui};
    transform: translate(28px,28px) rotate(45deg);
    font-size: 20px;
    background: #eee;
    transition: all.5s;
  }`;
  pathTilesIndicatorCount.style.width = '28px';
  pathTilesIndicatorCount.style.height = '28px';
  const pathTilesSvg = createSvgElement('svg');
  pathTilesSvg.setAttribute('viewBox', '0 0 18 18');
  pathTilesSvg.style.width = '54px';
  pathTilesSvg.style.height = '54px';
  pathTilesSvg.style.transform = 'rotate(45deg)';
  const pathTilesSvgPath = createSvgElement('path');
  pathTilesSvgPath.setAttribute('fill', 'none');
  pathTilesSvgPath.setAttribute('stroke', '#eee');
  // pathTilesPath.setAttribute('stroke-linejoin', 'round');
  pathTilesSvgPath.setAttribute('stroke-linecap', 'round');
  pathTilesSvgPath.setAttribute('stroke-width', 2);
  pathTilesSvgPath.setAttribute('d', 'M11 1h-3q-2 0-2 2t2 2h4q2 0 2 2t-2 2h-6q-2 0-2 2t2 2h4q2 0 2 2t-2 2h-3');
  pathTilesSvg.append(pathTilesSvgPath);
  // pathTilesIndicatorInner.append(pathTilesSvg);
  // pathTilesIndicatorInner.style.width = '64px';
  // pathTilesIndicatorInner.style.height = '64px';
  // pathTilesIndicatorInner.style.borderRadius = '16px'; // The only non-"infinity"?
  pathTilesIndicator.append(pathTilesSvg, pathTilesIndicatorCount);

  const pauseSvg = createSvgElement('svg');
  pauseSvg.setAttribute('viewBox', '0 0 16 16');
  pauseSvg.setAttribute('width', 64);
  pauseSvg.setAttribute('height', 64);
  pauseSvgPath.setAttribute('fill', colors.ui);
  pauseSvgPath.setAttribute('stroke', colors.ui);
  pauseSvgPath.setAttribute('stroke-width', 2);
  pauseSvgPath.setAttribute('stroke-linecap', 'round');
  pauseSvgPath.setAttribute('stroke-linejoin', 'round');
  pauseSvgPath.setAttribute('d', 'M6 6 6 10M10 6 10 8 10 10');
  pauseSvgPath.style.transition = 'all.2s';
  pauseSvgPath.style.transformOrigin = 'center';
  pauseSvgPath.style.transform = 'rotate(180deg)';
  pauseSvg.append(pauseSvgPath);

  pauseButton.style.cssText = 'position:absolute;top:24px;right:112px;padding:0;pointer-events:all';
  pauseButton.style.width = '64px';
  pauseButton.style.height = '64px';
  pauseButton.style.opacity = 0;
  pauseButton.style.transition = 'all.2s,opacity 1s';
  pauseButton.append(pauseSvg);

  uiContainer.append(scoreCounters, clock, pauseButton, pathTilesIndicator);
};
