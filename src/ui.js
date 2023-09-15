import { createSvgElement } from './svg-utils';
import { emojiOx } from './ox-emoji';
import { emojiGoat } from './goat-emoji';
import { emojiFish } from './fish-emoji';
import { colors } from './colors';
import { createElement } from './create-element';

export const uiContainer = createElement();

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

export const gridToggleButton = createElement('button');
export const gridToggleSvg = createSvgElement('svg');
export const gridToggleSvgPath = createSvgElement('path');
export const gridToggleTooltip = createElement();

export const gridRedToggleButton = createElement('button');
export const gridRedToggleSvg = createSvgElement('svg');
export const gridRedToggleSvgPath = createSvgElement('path');
export const gridRedToggleTooltip = createElement();

export const soundToggleButton = createElement('button');
export const soundToggleSvg = createSvgElement('svg');
export const soundToggleSvgPath = createSvgElement('path');
export const soundToggleSvgPathX = createSvgElement('path');
export const soundToggleTooltip = createElement();

export const initUi = () => {
  const styles = createElement('style');
  // body has user-select: none; to prevent text being highlighted.
  // ui black and shade colours inlined to make things smaller maybe
  styles.innerText = `
    body {
      position: relative;
      font-weight: 700;
      font-family: system-ui;
      color: ${colors.ui};
      margin: 0;
      width: 100vw;
      height: 100vh;
      user-select: none;
    }
    button {
      font-weight: 700;
      font-family: system-ui;
      color: ${colors.ui};
      border: none;
      padding: 0 20px;
      font-size: 32px;
      height: 56px;
      border-radius: 64px;
      background: ${colors.yurt};
      transition: all .2s, bottom .5s, right .5s, opacity 1s;
      box-shadow: 0 0 0 1px ${colors.shade};
    }
    button:hover {
      box-shadow: 4px 4px 0 1px ${colors.shade};
    }
    button:active {
      transform: scale(.95);
      box-shadow: 0 0 0 1px ${colors.shade};
    }
    u, abbr {
      text-decoration-thickness: 2px;
      text-underline-offset: 2px;
    }
  `;
  document.head.append(styles);

  uiContainer.style.cssText = `
    position: absolute;
    inset: 0;
    display: grid;
    overflow: hidden;
    pointer-events: none
  `;
  uiContainer.style.zIndex = 1;
  document.body.append(uiContainer);

  scoreCounters.style.cssText = `display:flex;position:absolute;top:16px;left:16px;`;
  scoreCounters.style.transition = `opacity 1s`;
  scoreCounters.style.opacity = 0;

  oxCounterWrapper.style.cssText = `display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s`;
  const oxCounterEmoji = emojiOx();
  oxCounterWrapper.style.width = 0;
  oxCounterWrapper.style.opacity = 0;
  oxCounterEmoji.style.width = '48px';
  oxCounterEmoji.style.height = '48px';
  oxCounterWrapper.append(oxCounterEmoji, oxCounter);

  goatCounterWrapper.style.cssText = `display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s`;
  const goatCounterEmoji = emojiGoat();
  goatCounterWrapper.style.width = 0;
  goatCounterWrapper.style.opacity = 0;
  goatCounterEmoji.style.width = '48px';
  goatCounterEmoji.style.height = '48px';
  goatCounterWrapper.append(goatCounterEmoji, goatCounter);

  fishCounterWrapper.style.cssText = `display:flex;align-items:center;gap:8px;transition:width 1s,opacity 1s 1s`;
  const fishCounterEmoji = emojiFish();
  fishCounterWrapper.style.width = 0;
  fishCounterWrapper.style.opacity = 0;
  fishCounterEmoji.style.width = '48px';
  fishCounterEmoji.style.height = '48px';
  fishCounterWrapper.append(fishCounterEmoji, fishCounter);

  scoreCounters.append(oxCounterWrapper, goatCounterWrapper, fishCounterWrapper);

  clock.style.cssText = `
    position: absolute;
    display: grid;
    top: 16px;
    right: 16px;
    place-items: center;
    border-radius: 64px;
    background: ${colors.ui}
  `;
  clock.style.width = '80px';
  clock.style.height = '80px';
  clock.style.opacity = 0;
  clock.style.transition = `opacity 1s`;

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
    dot.setAttribute('d', 'm8 14.5 0 0');
    dot.style.transform = `rotate(${i}grad)`;
    clockSvg.append(dot);
  }

  clockHand.setAttribute('stroke', '#eee');
  clockHand.setAttribute('transform-origin', 'center');
  clockHand.setAttribute('d', 'm8 4 0 4');
  clockSvg.append(clockHand);

  clockMonth.style.cssText = `position:absolute;bottom:8px;color:#eee`;

  clock.append(clockSvg, clockMonth);

  pathTilesIndicator.style.cssText = `
    position: absolute;
    display: grid;
    place-items: center;
    place-self: center;
    bottom: 20px;
    border-radius: 20px;
    background: ${colors.ui};
  `;
  if (document.body.scrollHeight < 500) {
    pathTilesIndicator.style.left = '20px';
  } else {
    pathTilesIndicator.style.left = '';
  }
  addEventListener('resize', () => {
    if (document.body.scrollHeight < 500) {
      pathTilesIndicator.style.left = '20px';
    } else {
      pathTilesIndicator.style.left = '';
    }
  });
  pathTilesIndicator.style.transform = 'rotate(-45deg)';
  pathTilesIndicator.style.opacity = 0;
  pathTilesIndicator.style.transition = `scale .4s cubic-bezier(.5, 2, .5, 1), opacity 1s`;
  pathTilesIndicator.style.width = '72px';
  pathTilesIndicator.style.height = '72px';
  pathTilesIndicatorCount.style.cssText = `
    position: absolute;
    display: grid;
    place-items: center;
    border-radius: 64px;
    border: 6px solid ${colors.ui};
    transform: translate(28px,28px) rotate(45deg);
    font-size: 18px;
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
  pauseSvgPath.style.transition = `all .2s`;
  pauseSvgPath.style.transformOrigin = 'center';
  pauseSvgPath.style.transform = 'rotate(180deg)';
  pauseSvg.append(pauseSvgPath);

  pauseButton.style.cssText = `position:absolute;padding:0;pointer-events:all`;
  if (document.body.scrollHeight < 500) {
    pauseButton.style.top = '108px';
    pauseButton.style.right = '20px';
  } else {
    pauseButton.style.top = '24px';
    pauseButton.style.right = '112px';
  }
  addEventListener('resize', () => {
    if (document.body.scrollHeight < 500) {
      pauseButton.style.top = '108px';
      pauseButton.style.right = '20px';
    } else {
      pauseButton.style.top = '24px';
      pauseButton.style.right = '112px';
    }
  });
  pauseButton.style.width = '64px';
  pauseButton.style.height = '64px';
  pauseButton.style.opacity = 0;
  pauseButton.append(pauseSvg);

  gridRedToggleSvg.setAttribute('viewBox', '0 0 16 16');
  gridRedToggleSvg.setAttribute('width', 48);
  gridRedToggleSvg.setAttribute('height', 48);
  gridRedToggleSvgPath.setAttribute('fill', 'none');
  gridRedToggleSvgPath.setAttribute('stroke', colors.red);
  gridRedToggleSvgPath.setAttribute('stroke-width', 2);
  gridRedToggleSvgPath.setAttribute('stroke-linecap', 'round');
  gridRedToggleSvgPath.setAttribute('stroke-linejoin', 'round');
  gridRedToggleSvgPath.style.transition = `all .3s`;
  gridRedToggleSvgPath.style.transformOrigin = 'center';
  gridRedToggleSvg.append(gridRedToggleSvgPath);
  gridRedToggleButton.append(gridRedToggleSvg);
  gridRedToggleButton.style.cssText = `position:absolute;bottom:72px;right:16px;padding:0;pointer-events:all;`;
  gridRedToggleButton.style.width = '48px';
  gridRedToggleButton.style.height = '48px';
  gridRedToggleTooltip.style.cssText = `
    position: absolute;
    display: flex;
    right: 16px;
    align-items: center;
    color: #eee;
    font-size: 16px;
    border-radius: 64px;
    padding: 0 64px 0 16px;
    white-space: pre;
    pointer-events: all;
    bottom: 72px;
    background: ${colors.ui};
  `;
  gridRedToggleTooltip.style.height = '48px';
  gridRedToggleTooltip.style.width = '96px';
  gridRedToggleTooltip.style.transition = `all .5s`;

  gridToggleSvg.setAttribute('viewBox', '0 0 16 16');
  gridToggleSvg.setAttribute('width', 48);
  gridToggleSvg.setAttribute('height', 48);
  gridToggleSvgPath.setAttribute('fill', 'none');
  gridToggleSvgPath.setAttribute('stroke', colors.ui);
  gridToggleSvgPath.setAttribute('stroke-width', 2);
  gridToggleSvgPath.setAttribute('stroke-linecap', 'round');
  gridToggleSvgPath.setAttribute('stroke-linejoin', 'round');
  gridToggleSvgPath.style.transition = `all .3s`;
  gridToggleSvgPath.style.transformOrigin = 'center';
  gridToggleSvg.append(gridToggleSvgPath);
  gridToggleButton.append(gridToggleSvg);
  gridToggleButton.style.cssText = `position:absolute;bottom:16px;right:16px;padding:0;pointer-events:all;`;
  gridToggleButton.style.width = '48px';
  gridToggleButton.style.height = '48px';
  gridToggleTooltip.style.cssText = `
    position: absolute;
    display: flex;
    right: 16px;
    align-items: center;
    color: #eee;
    font-size: 16px;
    border-radius: 64px;
    padding: 0 64px 0 16px;
    white-space: pre;
    pointer-events: all;
    bottom: 16px;
    background: ${colors.ui};
  `;
  gridToggleTooltip.style.height = '48px';
  gridToggleTooltip.style.width = '96px';
  gridToggleTooltip.style.transition = `all .5s`;

  soundToggleSvg.setAttribute('viewBox', '0 0 16 16');
  soundToggleSvg.setAttribute('width', 48);
  soundToggleSvg.setAttribute('height', 48);
  soundToggleSvgPath.setAttribute('fill', 'none');
  soundToggleSvgPath.setAttribute('stroke', colors.ui);
  soundToggleSvgPath.setAttribute('stroke-width', 2);
  soundToggleSvgPath.setAttribute('stroke-linecap', 'round');
  soundToggleSvgPath.setAttribute('stroke-linejoin', 'round');
  soundToggleSvgPath.style.transition = `all .3s`;
  soundToggleSvgPath.style.transformOrigin = 'center';
  soundToggleSvgPath.style.transform = 'rotate(0)';
  soundToggleSvgPath.setAttribute('d', 'M9 13 6 10 4 10 4 6 6 6 9 3');
  soundToggleSvgPathX.setAttribute('fill', 'none');
  soundToggleSvgPathX.setAttribute('stroke', colors.ui);
  soundToggleSvgPathX.setAttribute('stroke-width', 2);
  soundToggleSvgPathX.setAttribute('stroke-linecap', 'round');
  soundToggleSvgPathX.setAttribute('stroke-linejoin', 'round');
  soundToggleSvgPathX.style.transition = `all .3s`;
  soundToggleSvgPathX.style.transformOrigin = 'center';
  soundToggleSvgPathX.style.transform = 'rotate(0)';
  soundToggleSvg.append(soundToggleSvgPath, soundToggleSvgPathX);
  soundToggleButton.append(soundToggleSvg);
  soundToggleButton.style.cssText = `position:absolute;bottom:128px;right:16px;padding:0;pointer-events:all;`;
  soundToggleButton.style.width = '48px';
  soundToggleButton.style.height = '48px';
  soundToggleTooltip.style.cssText = `
    position: absolute;
    display: flex;
    right: 16px;
    align-items: center;
    color: #eee;
    font-size: 16px;
    border-radius: 64px;
    padding: 0 64px 0 16px;
    white-space: pre;
    pointer-events: all;
    bottom: 128px;
    background: ${colors.ui};
  `;
  soundToggleTooltip.style.height = '48px';
  soundToggleTooltip.style.width = '96px';
  soundToggleTooltip.style.transition = `all .5s`;

  uiContainer.append(
    scoreCounters,
    clock,
    pauseButton,
    pathTilesIndicator,
    gridRedToggleTooltip,
    gridRedToggleButton,
    gridToggleTooltip,
    gridToggleButton,
    soundToggleTooltip,
    soundToggleButton,
  );
};
