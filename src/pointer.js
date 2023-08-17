import { boardSvgWidth, boardSvgHeight, boardPxWidth, boardPxHeight, svgElement, createSvgElement } from './svg';
import { gridCellSize } from './grid';
import { Path, drawPaths, paths } from './path';
import { inventory } from './inventory';

// 384 / (72 / 8)
const gridCellSizePx = boardPxWidth / (boardSvgWidth / gridCellSize);

const gridCellPadding = 8; // Size in px of clicky cell padding (should be svg scaled instead of px?)

let dragging = false;

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
    return;
  }

  if (!isInsideCellPadding) {
    console.log('!isInsideCellPadding');
    return;
  }

  if (inventory.paths <= 0) {
    console.log('no path pieces left');
    // No paths left, show some sort of red flashy need more paths indicator
    return;
  }

  dragging = true;
  dragStartCell = { x: cellX, y: cellY };

  // const pathObject = new Path({ points: [{ x: cellX, y: cellY }, { x: cellX, y: cellY }]});
  // drawPaths();
  // newPath = pathObject;
}

const handlePointerdown = (event) => {
  const rect = svgElement.getBoundingClientRect();

  // TODO:
  // figure out starting cell?

  const { x: cellX, y: cellY, isInsideCellPadding } = getGridCellWithPadding(event.x - rect.left, event.y - rect.top);

  // tryAddPath({ cellX, cellY, isInsideCellPadding });

  dragging = true;
  dragStartCell = { x: cellX, y: cellY };

  // join the path piece to nearby paths?
};

const handlePointermove = (event) => {
  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) {
    return;
  }

  const rect = svgElement.getBoundingClientRect();

  if (dragging) {
    const { x: cellX, y: cellY, isInsideCellPadding } = getGridCellWithPadding(event.x - rect.left, event.y - rect.top);

    if (!isInsideCellPadding) {
      return;
    }

    // Same cell still, doesn't count
    if (cellX === dragStartCell.x && cellY === dragStartCell.y) {
      return;
    }

    newPath = new Path({ points: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }] });
    dragStartCell = { x: cellX, y: cellY };
    drawPaths();
  }

  // TODO:
  // is there a cell that was the starting cell for the pointerdown?
  // figure out current cell moving in
}

const handlePointerup = (event) => {
  // if (dragging) {
    // if (newPath.points[0].x === newPath.points[1].x && newPath.points[0].y === newPath.points[1].y) {
    //   newPath.remove();
    //   newPath = null;
    // }
  // }

  dragging = false;
  dragStartCell = { x: undefined, y: undefined };
  // console.log(event);
  // TODO:
  // clear the "starting cell pointer held down in"... maybe?
}

export const initPointer = (target) => {
  target.addEventListener('pointerdown', handlePointerdown);
  target.addEventListener('pointermove', handlePointermove);
  target.addEventListener('pointerup', handlePointerup);
}
