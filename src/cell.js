import {
  boardWidth, boardOffsetX, boardOffsetY, gridCellSize,
} from './svg';
import { gridPointerLayer } from './layers';

export const getGridCell = (x, y) => {
  const cellSizePx = gridPointerLayer.getBoundingClientRect().width / boardWidth;

  return {
    x: Math.floor(x / cellSizePx),
    y: Math.floor(y / cellSizePx),
  };
};

export const getBoardCell = (x, y) => {
  const cellSizePx = gridPointerLayer.getBoundingClientRect().width / boardWidth;

  return {
    x: boardOffsetX + Math.floor(x / cellSizePx),
    y: boardOffsetY + Math.floor(y / cellSizePx),
  };
};

export const svgPxToDisplayPx = (x, y) => {
  const cellSizePx = gridPointerLayer.getBoundingClientRect().width / boardWidth;

  return {
    x: (boardOffsetX + x) * cellSizePx,
    y: (boardOffsetY + y) * cellSizePx,
  };
};

export const pointerPxToSvgPx = (x, y) => {
  const cellSizePx = gridPointerLayer.getBoundingClientRect().width / boardWidth;
  const scale = cellSizePx / gridCellSize;

  return {
    x: (boardOffsetX * gridCellSize) + (x / scale),
    y: (boardOffsetY * gridCellSize) + (y / scale),
  };
};

export const isPastHalfwayInto = ({ pointer, from, to }) => {
  const cellSizePx = gridPointerLayer.getBoundingClientRect().width / boardWidth;
  // TODO: convert from display px to svg px to align with cells better
  const fuzzyness = 4; // In device px, how closish to half way is required
  const xDiff = pointer.x - cellSizePx * (from.x - boardOffsetX + 0.5);
  const yDiff = pointer.y - cellSizePx * (from.y - boardOffsetY + 0.5);
  const top = to.y - from.y < 0;
  const right = to.x - from.x > 0;
  const bottom = to.y - from.y > 0;
  const left = to.x - from.x < 0;
  const xMid = to.x === from.x;
  const yMid = to.y === from.y;

  if (top && xMid) return yDiff < -cellSizePx + fuzzyness;
  if (top && right) return xDiff - yDiff > cellSizePx * 2 - fuzzyness;
  if (yMid && right) return xDiff > cellSizePx - fuzzyness;
  if (bottom && right) return xDiff + yDiff > cellSizePx * 2 - fuzzyness;
  if (bottom && xMid) return yDiff > cellSizePx - fuzzyness;
  if (bottom && left) return xDiff + -yDiff < -cellSizePx * 2 + fuzzyness;
  if (yMid && left) return xDiff < -cellSizePx + fuzzyness;
  if (top && left) return xDiff + yDiff < -cellSizePx * 2 + fuzzyness;

  // TODO: Maybe remove or swap to void to save space
  // false would make more sense than undefined, but undefined gets minified out(?)
  return undefined;
};
