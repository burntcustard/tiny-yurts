import { createSvgElement, svgElement } from './svg';
import { Path, drawPaths, paths } from './path';
import { inventory } from './inventory';
import { isPastHalfwayInto, getGridCell, getBoardCell } from './cell';
import { farms } from './farm';
import { yurts } from './yurt';
import { gridCellSize, gridRect, gridRectRed } from './grid';
import { gridPointerLayer } from './layers';
import { svgHazardLines, svgHazardLinesRed, svgContainerElement } from './svg';
import { removePath } from './remove-path';
import { colors } from './colors';

let dragStartCell = {};
let isDragging = false;

const yurtInCell = (x, y) => yurts.find((yurt) => yurt.x === x && yurt.y === y);
const farmInCell = (x, y) => farms.find((farm) => farm.x === x && farm.y === y);
const samePathInBothCell = (x0, y0, x1, y1) => paths.find((path) => (
  (
    (path.points[0].x === x0 && path.points[0].y === y0)
    &&
    (path.points[1].x === x1 && path.points[1].y === y1)
  ) || (
    (path.points[1].x === x0 && path.points[1].y === y0)
    &&
    (path.points[0].x === x1 && path.points[0].y === y1)
  )
));

const handlePointerdown = (event) => {
  event.stopPropagation(); // Prevent hazard area event handling after this
  const rect = gridPointerLayer.getBoundingClientRect();
  const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);

  // Draw a debug circle
  // const debugCircle = createSvgElement('circle');
  // debugCircle.setAttribute('fil', 'red');
  // debugCircle.setAttribute('r', 1);
  // debugCircle.setAttribute('cx', gridCellSize / 2 + cellX * gridCellSize);
  // debugCircle.setAttribute('cy', gridCellSize / 2 + cellY * gridCellSize);
  // svgElement.append(debugCircle);


  if (event.buttons === 1) {
    if (farmInCell(cellX, cellY)) return;

    gridRect.style.opacity = 1;
    svgHazardLines.style.opacity = 0.9;

    isDragging = true;
    dragStartCell = { x: cellX, y: cellY };
    const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
    if (yurtInStartCell) {
      yurtInStartCell.lift();
    }
  } else if (event.buttons === 2) {
    gridRectRed.style.opacity = 0.9;
    svgHazardLinesRed.style.opacity = 0.9;
    removePath(cellX, cellY);
  }
};

const handleHazardPointerdown = () => {
  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;
}

const handleHazardPointermove = (event) => {
  if (event.buttons !== 1) return;

  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;
  gridRect.style.opacity = 0;
  svgHazardLines.style.opacity = 0;
}

const handleHazardPointerup = () => {
  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;
}

const handlePointerup = (event) => {
  event.stopPropagation();
  const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);

  gridRect.style.opacity = 0;
  svgHazardLines.style.opacity = 0;
  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;

  if (yurtInStartCell) yurtInStartCell.place();
}

const handlePointermove = (event) => {
  // Do not trigger hazard area pointermove
  event.stopPropagation();

  if (event.buttons === 2) {
    gridRectRed.style.opacity = 0.9;
    svgHazardLinesRed.style.opacity = 0.9;

    const rect = gridPointerLayer.getBoundingClientRect();
    const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);

    removePath(cellX, cellY);
    return;
  }

  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) return;

  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;

  gridRect.style.opacity = 1;
  svgHazardLines.style.opacity = 0.9;

  if (!isDragging) return;

  const rect = gridPointerLayer.getBoundingClientRect();
  const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);

  const xDiff = Math.abs(cellX - dragStartCell.x);
  const yDiff = Math.abs(cellY - dragStartCell.y);

  // Same cell or >1 cell apart somehow, do nothing
  if (
    (xDiff === 0 && yDiff === 0)
    || xDiff > 1
    || yDiff > 1
  ) return;

  // We actually don't want to block building paths in farms :)
  // if (farmInCell(cellX, cellY)) {
  //   dragStartCell = {};
  //   isDragging = false;
  //   return;
  // }

  // Have we gone +50% into the new cell?
  if (!isPastHalfwayInto({
    pointer: { x: event.x - rect.left, y: event.y - rect.top },
    from: { x: dragStartCell.x, y: dragStartCell.y },
    to: { x: cellX, y: cellY },
  })) return;

  const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
  const yurtInEndCell = yurtInCell(cellX, cellY);

  if (yurtInStartCell) {
    yurtInStartCell.rotateTo(cellX, cellY);
    dragStartCell = { x: cellX, y: cellY };
    yurtInStartCell.place();
    return;
  } if (yurtInEndCell) {
    // You can't drag through yurt because it was causing too many weird bugs
    yurtInEndCell.rotateTo(dragStartCell.x, dragStartCell.y);
    dragStartCell = {};
    isDragging = false;
    yurtInEndCell.place();
    return;
  }

  // No paths check is done after yurt shenanigans
  if (inventory.paths <= 0) {
    dragStartCell = {};
    isDragging = false;
    return;
  }

  if (samePathInBothCell(dragStartCell.x, dragStartCell.y, cellX, cellY)) {
    return;
  }

  const newPath = new Path({ points: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }] });

  inventory.paths--;

  drawPaths({ changedCells: [{ x: dragStartCell.x, y: dragStartCell.y }, { x: cellX, y: cellY }], newPath });

  dragStartCell = { x: cellX, y: cellY };
};

export const initPointer = () => {
  svgContainerElement.addEventListener('pointerdown', handleHazardPointerdown);
  svgContainerElement.addEventListener('pointermove', handleHazardPointermove);
  svgContainerElement.addEventListener('pointerup', handleHazardPointerup);
  svgContainerElement.addEventListener('contextmenu', (event) => event.preventDefault());
  gridPointerLayer.addEventListener('pointerdown', handlePointerdown);
  gridPointerLayer.addEventListener('pointermove', handlePointermove);
  gridPointerLayer.addEventListener('pointerup', handlePointerup);
};
