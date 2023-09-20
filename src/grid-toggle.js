import { svgHazardLines, svgHazardLinesRed } from './svg';
import { gridRect, gridRectRed } from './grid';
import { gridPointerLayer } from './layers';
import {
  gridToggleSvgPath, gridRedToggleSvgPath, gridToggleTooltip, gridRedToggleTooltip,
} from './ui';
import { initAudio, playSound } from './audio';

let gridLocked = localStorage.getItem('Tiny Yurtsg') === 'true';

export const gridRedState = {
  locked: false,
  on: false,
};

export const gridShow = () => {
  svgHazardLines.style.opacity = 0.9;
  gridRect.style.opacity = 1;

  if (!gridLocked) {
    // #
    gridToggleSvgPath.setAttribute('d', 'M6 5 6 11M10 5 10 11M5 6 8 6 11 6M5 10 11 10');
    gridToggleSvgPath.style.transform = 'rotate(180deg)';
  }
};

export const gridHide = () => {
  if (!gridLocked) {
    svgHazardLines.style.opacity = 0;
    gridRect.style.opacity = 0;

    // A
    gridToggleSvgPath.setAttribute('d', 'M8 4.5 5 11M8 4.5 11 11M5 11 8 4.5 11 11M6 9.5 10 9.5');
    gridToggleSvgPath.style.transform = 'rotate(0)';
  }
};

if (gridLocked) {
  gridToggleTooltip.innerHTML = 'Grid: <u>On';
  gridShow();
  gridToggleSvgPath.setAttribute('d', 'M6 5 6 11M10 5 10 11M5 6 8 6 11 6M5 10 11 10');
  gridToggleSvgPath.style.transform = 'rotate(180deg)';
} else {
  gridToggleTooltip.innerHTML = 'Grid: <u>Auto';
  gridHide();
}

export const gridLockToggle = () => {
  initAudio();

  if (gridLocked) {
    gridLocked = false;
    gridHide();
    localStorage.setItem('Tiny Yurtsg', false);
    gridToggleTooltip.innerHTML = 'Grid: <u>Auto';
  } else {
    gridShow();
    localStorage.setItem('Tiny Yurtsg', true);
    gridLocked = true;
    gridToggleTooltip.innerHTML = 'Grid: <u>On';
  }

  playSound(25, 1, 1, 1, 0.3, 1000, 1000);
};

export const gridRedShow = () => {
  gridPointerLayer.style.cursor = 'crosshair';
  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;

  if (!gridRedState.locked) {
    // ☒ (trash / bulldoze mode)
    gridRedToggleSvgPath.setAttribute(
      'd',
      'M4.5 4.5Q4.5 4.5 11.5 4.5 11.5 4.5 11.5 4.5 11.5 11.5 11.5 11.5 11.5 11.5 11.5 11.5 4.5 11.5 4.5 11.5ZM9 7 7 9M7 7Q9 9 9 9',
    );
    gridRedToggleSvgPath.style.transform = 'rotate(180deg)';
  }
};

export const gridRedHide = () => {
  if (!gridRedState.locked) {
    gridRectRed.style.opacity = 0;
    svgHazardLinesRed.style.opacity = 0;

    // Right Click
    gridRedToggleSvgPath.setAttribute('d', 'M5 7Q5 4 8 4 11 4 11 7 11 8 11 9 11 12 8 12 5 12 5 9ZM8 4 8 8 M8 8 Q11 8 11 7.5');
    gridRedToggleSvgPath.style.transform = 'rotate(0)';
  }
};

if (gridRedState.locked) {
  gridRedToggleTooltip.innerHTML = 'Delete: <u>On';
  // ☒ (trash / bulldoze mode)
  gridRedToggleSvgPath.setAttribute(
    'd',
    'M4.5 4.5 Q4.5 4.5 11.5 4.5 11.5 4.5 11.5 4.5 11.5 11.5 11.5 11.5 11.5 11.5 11.5 11.5 4.5 11.5 4.5 11.5ZM9 7 7 9M7 7Q9 9 9 9',
  );
  gridRedToggleSvgPath.style.transform = 'rotate(180deg)';
} else {
  gridRedToggleTooltip.innerHTML = 'Delete: <abbr title="Right Mouse Button">RMB';
  // A
  gridRedToggleSvgPath.setAttribute('d', 'M5 7Q5 4 8 4 11 4 11 7 11 8 11 9 11 12 8 12 5 12 5 9ZM8 4 8 8 M8 8 Q11 8 11 7.5');
  gridRedToggleSvgPath.style.transform = 'rotate(0)';
}

export const gridRedLockToggle = () => {
  initAudio();

  if (gridRedState.locked) {
    gridRedState.locked = false;
    gridRedHide();
    gridRedToggleTooltip.innerHTML = 'Delete: <abbr title="Right Mouse Button">RMB';
  } else {
    gridRedShow();
    gridRedState.locked = true;
    gridRedToggleTooltip.innerHTML = 'Delete: <u>On';
  }

  playSound(27, 1, 1, 1, 0.3, 1000, 1000);
};
