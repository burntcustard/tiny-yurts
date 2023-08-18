import { svgElement } from './svg';
import { Path, drawPaths, paths } from './path';
import { inventory } from './inventory';
import { structures } from './structure';
import { isPastHalfwayInto, getGridCell } from './cell';

let dragging = false;

let dragStartCell = {
  x: undefined,
  y: undefined,
};

const isCellOccupied = ({ x, y }) => structures.some(s => s.x === x && s.y === y);

const okayToBuild = ({ x, y }) => {
  if (inventory.paths <= 0) {
    console.log('no path pieces left');
    // No paths left, show some sort of red flashy need more paths indicator
    return;
  }

  if (isCellOccupied({ x, y })) {
    console.log('cant build there mate');
    return;
  }

  return true;
}

const handlePointerdown = (event) => {
  const rect = svgElement.getBoundingClientRect();

  const { x: cellX, y: cellY } = getGridCell(event.x - rect.left, event.y - rect.top);

  if (event.buttons === 1) {
    if (!okayToBuild({ x: cellX, y: cellY })) return;

    dragging = true;
    dragStartCell = { x: cellX, y: cellY };
  } else if (event.buttons === 2) {
    paths.filter(path =>
      (
        (path.points[0].x === cellX && path.points[0].y === cellY) ||
        (path.points[1].x === cellX && path.points[1].y === cellY)
      ) && (
        !path.points[0].fixed && !path.points[1].fixed
      )
    ).forEach(pathToRemove => pathToRemove.remove());

    drawPaths();
  }
};

const handlePointermove = (event) => {
  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) {
    return;
  }

  const rect = svgElement.getBoundingClientRect();

  if (dragging) {
    const { x: cellX, y: cellY } = getGridCell(event.x - rect.left, event.y - rect.top);

    if (!okayToBuild({ x: cellX, y: cellY })) return;

    // if (!isInsideCellPadding) return;

    // Same cell still, doesn't count
    if (cellX === dragStartCell.x && cellY === dragStartCell.y) return;

    // Have we gone +50% into the new cell?
    if (!isPastHalfwayInto({
      pointer: { x: event.x - rect.left, y: event.y - rect.y },
      from: { x: dragStartCell.x, y: dragStartCell.y },
      to: { x: cellX, y: cellY }
    })) return;

    new Path({ points: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }] });

    dragStartCell = { x: cellX, y: cellY };

    drawPaths();
  }

  // TODO:
  // is there a cell that was the starting cell for the pointerdown?
  // figure out current cell moving in
}

const handlePointerup = (event) => {
  dragging = false;
  dragStartCell = { x: undefined, y: undefined };
}

export const initPointer = (target) => {
  target.addEventListener('contextmenu', (event) => event.preventDefault());
  target.addEventListener('pointerdown', handlePointerdown);
  target.addEventListener('pointermove', handlePointermove);
  target.addEventListener('pointerup', handlePointerup);
}
