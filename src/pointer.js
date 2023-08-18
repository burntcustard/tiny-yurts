import { svgElement } from './svg';
import { Path, drawPaths, paths } from './path';
import { inventory } from './inventory';
import { isPastHalfwayInto, getGridCell } from './cell';
import { farms } from './farm';
import { yurts } from './yurt';

let dragStartCell = {};
let isDragging = false;
const rect = svgElement.getBoundingClientRect();

const yurtInCell = (x, y) => yurts.find((yurt) => yurt.x === x && yurt.y === y);
const farmInCell = (x, y) => farms.find((farm) => farm.x === x && farm.y === y);

const cantBuildNoPaths = () => {

};

const removePathsOnRightClick = (x, y) => {
  paths.filter((path) => (
    (path.points[0].x === x && path.points[0].y === y)
      || (path.points[1].x === x && path.points[1].y === y)
  ) && (
  // Don't remove "fixed" paths i.e. under yurts
    !path.points[0].fixed && !path.points[1].fixed
  )).forEach((pathToRemove) => pathToRemove.remove());

  drawPaths({ changedCells: [{ x, y }] });
};

const handlePointerdown = (event) => {
  const { x: cellX, y: cellY } = getGridCell(event.x - rect.left, event.y - rect.top);

  if (event.buttons === 1) {
    if (farmInCell(cellX, cellY)) return;
    isDragging = true;
    dragStartCell = { x: cellX, y: cellY };
  } else if (event.buttons === 2) {
    removePathsOnRightClick(cellX, cellY);
  }
};

const handlePointermove = (event) => {
  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) return;

  if (!isDragging) return;

  const { x: cellX, y: cellY } = getGridCell(event.x - rect.left, event.y - rect.top);

  const xDiff = Math.abs(cellX - dragStartCell.x);
  const yDiff = Math.abs(cellY - dragStartCell.y);

  // Same cell or >1 cell apart somehow, do nothing
  if (
    (xDiff === 0 && yDiff === 0)
    || xDiff > 1
    || yDiff > 1
  ) return;

  if (farmInCell(cellX, cellY)) {
    dragStartCell = {};
    isDragging = false;
    return;
  }

  // Have we gone +50% into the new cell?
  if (!isPastHalfwayInto({
    pointer: { x: event.x - rect.left, y: event.y - rect.y },
    from: { x: dragStartCell.x, y: dragStartCell.y },
    to: { x: cellX, y: cellY },
  })) return;

  const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
  const yurtInEndCell = yurtInCell(cellX, cellY);

  if (yurtInStartCell) {
    yurtInStartCell.rotateTo(cellX, cellY);
    dragStartCell = {};
    isDragging = false;
    return;
  } if (yurtInEndCell) {
    yurtInEndCell.rotateTo(dragStartCell.x, dragStartCell.y);
    dragStartCell = {};
    isDragging = false;
    return;
  }

  if (inventory.paths <= 0) {
    cantBuildNoPaths();
    dragStartCell = {};
    isDragging = false;
    return;
  }

  const newPath = new Path({ points: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }] });

  drawPaths({ changedCells: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }], newPath });

  dragStartCell = { x: cellX, y: cellY };
};

export const initPointer = (target) => {
  target.addEventListener('contextmenu', (event) => event.preventDefault());
  target.addEventListener('pointerdown', handlePointerdown);
  target.addEventListener('pointermove', handlePointermove);
};
