import { gridCellSize } from './grid';
import { boardSvgWidth, boardPxWidth } from './svg';

// 384 / (72 / 8)
export const cellSizePx = boardPxWidth / (boardSvgWidth / gridCellSize);

export const getGridCell = (x, y) => {
  return {
    x: Math.floor(x / cellSizePx),
    y: Math.floor(y / cellSizePx),
  }
}

export const isPastHalfwayInto = ({ pointer, from, to }) => {
  const fuzzyness = 4; // In px, how closish to half way is required
  const xDiff = pointer.x - cellSizePx * (from.x + 0.5);
  const yDiff = pointer.y - cellSizePx * (from.y + 0.5);
  const top = to.y - from.y < 0;
  const right = to.x - from.x > 0;
  const bottom = to.y - from.y > 0;
  const left = to.x - from.x < 0;
  const xMid = to.x === from.x;
  const yMid = to.y === from.y;

  if (   top && xMid ) return          yDiff < -cellSizePx + fuzzyness;
  if (   top && right) return xDiff -  yDiff >  cellSizePx * 2 - fuzzyness;
  if (  yMid && right) return xDiff          >  cellSizePx - fuzzyness;
  if (bottom && right) return xDiff +  yDiff >  cellSizePx * 2 - fuzzyness;
  if (bottom && xMid ) return          yDiff >  cellSizePx - fuzzyness;
  if (bottom && left ) return xDiff + -yDiff < -cellSizePx * 2 + fuzzyness;
  if (  yMid && left ) return xDiff          < -cellSizePx + fuzzyness;
  if (   top && left ) return xDiff +  yDiff < -cellSizePx * 2 + fuzzyness;
}
