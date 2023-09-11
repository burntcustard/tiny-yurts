import { svgHazardLines, svgHazardLinesRed } from './svg';
import { gridRect, gridRectRed } from './grid';
import { gridPointerLayer } from './layers';
import { gridToggleButton, gridToggleSvgPath, gridRedToggleSvgPath, gridToggleTooltip, gridRedToggleTooltip } from './ui';

let gridLocked = localStorage.getItem('Tiny Yurts g') === 'true' ? true : false;

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
  if (gridLocked) {
    gridLocked = false;
    gridHide();
    localStorage.setItem('Tiny Yurts g', false);
    gridToggleTooltip.innerHTML = 'Grid: <u>Auto';
  } else {
    gridShow();
    localStorage.setItem('Tiny Yurts g', true);
    gridLocked = true;
    gridToggleTooltip.innerHTML = 'Grid: <u>On';
  }
};

export const gridRedShow = () => {
  gridPointerLayer.style.cursor = 'crosshair';
  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;

  if (!gridRedState.locked) {
    // ☒ (trash / bulldoze mode)
    gridRedToggleSvgPath.setAttribute('d', 'M9 7 7 9M7 7 9 9M4.5 11.5 4.5 4.5 11.5 4.5 11.5 11.5M4.5 11.5 11.5 11.5');
    gridRedToggleSvgPath.style.transform = 'rotate(180deg)';
  }
};

export const gridRedHide = () => {
  if (!gridRedState.locked) {
    gridRectRed.style.opacity = 0;
    svgHazardLinesRed.style.opacity = 0;

    // A
    gridRedToggleSvgPath.setAttribute('d', 'M8 4.5 5 11M8 4.5 11 11M5 11 8 4.5 8 4.5 11 11M6 9.5 10 9.5');
    gridRedToggleSvgPath.style.transform = 'rotate(0)';
  }
};

if (gridRedState.locked) {
  gridRedToggleTooltip.innerHTML = 'Delete: <u>On';
  // ☒ (trash / bulldoze mode)
  gridRedToggleSvgPath.setAttribute('d', 'M9 7 7 9M7 7 9 9M4.5 11.5 4.5 4.5 11.5 4.5 11.5 11.5M4.5 11.5 11.5 11.5');
  gridRedToggleSvgPath.style.transform = 'rotate(180deg)';
} else {
  gridRedToggleTooltip.innerHTML = 'Delete: <u>Auto';
  // A
  gridRedToggleSvgPath.setAttribute('d', 'M8 4.5 5 11M8 4.5 11 11M5 11 8 4.5 8 4.5 11 11M6 9.5 10 9.5');
  gridRedToggleSvgPath.style.transform = 'rotate(0)';
}

export const gridRedLockToggle = () => {
  if (gridRedState.locked) {
    gridRedState.locked = false;
    gridRedHide();
    gridRedToggleTooltip.innerHTML = 'Delete: <u>Auto';
  } else {
    gridRedShow();
    gridRedState.locked = true;
    gridRedToggleTooltip.innerHTML = 'Delete: <u>On';
  }
};
