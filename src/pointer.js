import { boardSvgWidth, boardSvgHeight, boardPxWidth, boardPxHeight, svgElement, createSvgElement } from './svg';
import { gridCellSize } from './grid';
import { Path } from './path';
import { inventory } from './inventory';

// 384 / (72 / 8)
const gridCellSizePx = boardPxWidth / (boardSvgWidth / gridCellSize);

const gridCellPadding = 8; // Size in px of clicky cell padding (should be svg scaled instead of px?)

let dragStartCell = {
  x: undefined,
  y: undefined,
};

const getGridCell = (x, y) => {

  return {
    x: Math.floor(x / gridCellSizePx),
    y: Math.floor(y / gridCellSizePx),
  }
}

const getGridCellWithPadding = (x, y) => {
  const { x: cellX, y: cellY } = getGridCell(x, y);
  const internalX = x - cellX * gridCellSizePx;
  const internalY = y - cellY * gridCellSizePx;
  // Maybe x and y will have different amounts of padding if... like, thumbs are weird
  const isInPaddingX = gridCellPadding < internalX && internalX < gridCellSizePx - gridCellPadding;
  const isInPaddingY = gridCellPadding < internalY && internalY < gridCellSizePx - gridCellPadding;

  return {
    x: cellX,
    y: cellY,
    isInsideCellPadding: isInPaddingX && isInPaddingY,
  };
}

let newPath = null;

const tryAddPath = ({ cellX, cellY, isInsideCellPadding }) => {
  const gridCellAlreadyHasSomethingIn = false;

  if (gridCellAlreadyHasSomethingIn) {
    console.log('gridCellAlreadyHasSomethingIn');
    // do nothing
    /// .... unless? Maybe the start of the path is in a yurt? Or at the edge of a farm?
  }

  if (!isInsideCellPadding) {
    console.log('!isInsideCellPadding');
    // do nothing
  }

  if (inventory.paths <= 0) {
    console.log('no path pieces left');
    // No paths left, show some sort of red flashy need more paths indicator
  }

  dragStartCell = { x: cellX, y: cellY };

  const pathObject = new Path({ x: cellX, y: cellY });
  pathObject.addToSvg();
  newPath = pathObject;
}

const handlePointerdown = (event) => {
  const rect = event.target.getBoundingClientRect();

  // TODO:
  // figure out starting cell?

  const { x: cellX, y: cellY, isInsideCellPadding } = getGridCellWithPadding(event.x - rect.left, event.y - rect.top);

  tryAddPath({ cellX, cellY, isInsideCellPadding });

  // join the path piece to nearby paths?
};

const handlePointermove = (event) => {
  const rect = event.target.getBoundingClientRect();

  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) {
    return;
  }

  if (newPath) {
    console.log('theres a path lets extend it?');

    const { x: cellX, y: cellY, isInsideCellPadding } = getGridCellWithPadding(event.x - rect.left, event.y - rect.top);

    if (cellX === newPath.x && cellY === newPath.y) {
      console.log('same cell doesnt count');
      return;
    }

    if (cellX === newPath.points.at(-1)?.x && cellY === newPath.points.at(-1)?.y) {
      console.log('same as last point of a different path');
      return;
    }

    if (isInsideCellPadding) {
      console.log('adding a point to the path');
      newPath.addPoint({ x: cellX, y: cellY });
    }
  }

  // TODO:
  // is there a cell that was the starting cell for the pointerdown?
  // figure out current cell moving in
}

const handlePointerup = (event) => {
  // console.log(event);
  // TODO:
  // clear the "starting cell pointer held down in"... maybe?
}

export const initPointer = (target) => {
  target.addEventListener('pointerdown', handlePointerdown);
  target.addEventListener('pointermove', handlePointermove);
  target.addEventListener('pointerup', handlePointerup);
}
