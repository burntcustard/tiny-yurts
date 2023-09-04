import { Vector } from 'kontra';
import { createSvgElement } from './svg-utils';
import {
  svgHazardLines, svgHazardLinesRed, svgContainerElement, gridCellSize,
} from './svg';
import { Path, drawPaths, paths } from './path';
import { inventory } from './inventory';
import { isPastHalfwayInto, getBoardCell } from './cell';
import { yurts } from './yurt';
import { gridRect, gridRectRed } from './grid';
import { gridPointerLayer, pathShadowLayer } from './layers';
import { removePath } from './remove-path';
import { ponds } from './pond';

let dragStartCell = {};
let isDragging = false;

const yurtInCell = (x, y) => yurts.find((yurt) => yurt.x === x && yurt.y === y);
const pondInCell = (x, y) => ponds.find((pond) => pond.points.find((p) => p.x === x && p.y === y));
const pondPathInCell = (x, y) => paths
  .find((path) => path.points[1].x === x && path.points[1].y === y && path.points[1].stone);

const samePathInBothCell = (x0, y0, x1, y1) => paths.find((path) => (
  (
    (path.points[0].x === x0 && path.points[0].y === y0)
    && (path.points[1].x === x1 && path.points[1].y === y1)
  ) || (
    (path.points[1].x === x0 && path.points[1].y === y0)
    && (path.points[0].x === x1 && path.points[0].y === y1)
  )
));

const toSvgCoord = (c) => gridCellSize / 2 + c * gridCellSize;
// The pathDragIndicatorWrapper controls the x/y positioning of the indicator
const pathDragIndicatorWrapper = createSvgElement('g');
// The pathDragIndicator controls the scale and the path d of the indicator
const pathDragIndicator = createSvgElement('path');
pathDragIndicator.style.opacity = 0;
pathDragIndicator.style.scale = 0;
pathDragIndicator.style.transition = 'all.2s, scale.4s cubic-bezier(.5,2,.5,1)';
pathDragIndicatorWrapper.append(pathDragIndicator);
pathShadowLayer.append(pathDragIndicatorWrapper);

const handlePointerdown = (event) => {
  event.stopPropagation(); // Prevent hazard area event handling after this
  const rect = gridPointerLayer.getBoundingClientRect();
  const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);

  if (event.buttons === 1) {
    gridRect.style.opacity = 1;
    svgHazardLines.style.opacity = 0.9;

    const pondInStartCell = pondInCell(cellX, cellY);
    const pondPathInStartCell = pondPathInCell(cellX, cellY);
    if (pondInStartCell && !pondPathInStartCell) return;

    isDragging = true;
    dragStartCell = { x: cellX, y: cellY };

    const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
    if (yurtInStartCell) {
      yurtInStartCell.lift();
      gridPointerLayer.style.cursor = 'grabbing';
    } else {
      pathDragIndicator.setAttribute('d', 'M0 0l0 0');
      pathDragIndicatorWrapper.setAttribute('transform', `translate(${toSvgCoord(cellX)} ${toSvgCoord(cellY)})`);
      pathDragIndicator.style.opacity = 1;
      pathDragIndicator.style.scale = 1.3;
      pathDragIndicator.style.transition = 'all.2s, scale.4s cubic-bezier(.5,2,.5,1)';
    }
  } else if (event.buttons === 2) {
    gridPointerLayer.style.cursor = 'crosshair';
    gridRectRed.style.opacity = 0.9;
    svgHazardLinesRed.style.opacity = 0.9;
    removePath(cellX, cellY);
  }
};

const handleHazardPointerdown = () => {
  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;
};

const handleHazardPointermove = (event) => {
  if (event.buttons !== 1) return;

  gridRectRed.style.opacity = 0.9;
  svgHazardLinesRed.style.opacity = 0.9;
  gridRect.style.opacity = 0;
  svgHazardLines.style.opacity = 0;
};

const handleHazardPointerup = () => {
  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;
};

const handlePointerup = (event) => {
  event.stopPropagation();
  const rect = gridPointerLayer.getBoundingClientRect();
  const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);
  const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
  const yurtInEndCell = yurtInCell(cellX, cellY);
  const pondInStartCell = pondInCell(cellX, cellY);
  const pondPathInStartCell = pondPathInCell(cellX, cellY);

  if (pondInStartCell && !pondPathInStartCell) {
    gridPointerLayer.style.cursor = 'not-allowed';
  } else if (yurtInEndCell) {
    gridPointerLayer.style.cursor = 'grab';
  } else {
    gridPointerLayer.style.cursor = 'cell';
  }

  gridRect.style.opacity = 0;
  svgHazardLines.style.opacity = 0;
  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;

  pathDragIndicator.style.opacity = 0;
  pathDragIndicator.style.scale = 0;

  if (yurtInStartCell) {
    yurtInStartCell.place();
  }

  dragStartCell = {};
  isDragging = false;
};

const handlePointermove = (event) => {
  // Do not trigger hazard area pointermove
  event.stopPropagation();

  const rect = gridPointerLayer.getBoundingClientRect();
  const { x: cellX, y: cellY } = getBoardCell(event.x - rect.left, event.y - rect.top);

  if (event.buttons === 2) {
    gridPointerLayer.style.cursor = 'crosshair';
    gridRectRed.style.opacity = 0.9;
    svgHazardLinesRed.style.opacity = 0.9;

    removePath(cellX, cellY);
    return;
  }

  const yurtInStartCell = yurtInCell(dragStartCell.x, dragStartCell.y);
  const yurtInEndCell = yurtInCell(cellX, cellY);
  const pondInStartCell = pondInCell(cellX, cellY);
  const pondPathInStartCell = pondPathInCell(cellX, cellY);
  if (pondInStartCell && !pondPathInStartCell) {
    gridPointerLayer.style.cursor = 'not-allowed';
    return;
  }

  // Assign cursor
  if (yurtInEndCell && event.buttons !== 1) {
    gridPointerLayer.style.cursor = 'grab';
  } else if (
    event.buttons === 1
    && ((yurtInStartCell && yurtInEndCell) || (yurtInStartCell && !yurtInEndCell))
  ) {
    gridPointerLayer.style.cursor = 'grabbing';
  } else if (!samePathInBothCell(dragStartCell.x, dragStartCell.y, cellX, cellY)) {
    gridPointerLayer.style.cursor = 'cell';
  }

  // Is left click being held down? If not, we don't care
  if (event.buttons !== 1) return;

  gridRectRed.style.opacity = 0;
  svgHazardLinesRed.style.opacity = 0;

  gridRect.style.opacity = 1;
  svgHazardLines.style.opacity = 0.9;

  if (!isDragging) return;

  const xDiff = cellX - dragStartCell.x;
  const yDiff = cellY - dragStartCell.y;

  const dragStartSvgPx = new Vector({
    x: toSvgCoord(dragStartCell.x),
    y: toSvgCoord(dragStartCell.y),
  });

  const L = `${toSvgCoord(xDiff / 2 - 0.5)} ${toSvgCoord(yDiff / 2 - 0.5)}`;
  pathDragIndicatorWrapper.setAttribute('transform', `translate(${dragStartSvgPx.x} ${dragStartSvgPx.y})`);
  pathDragIndicator.setAttribute('d', `M0 0L${L}`);
  pathDragIndicator.style.opacity = 1;
  pathDragIndicator.style.scale = 1.3;

  // Same cell or >1 cell apart somehow, do nothing
  if (
    (xDiff === 0 && yDiff === 0)
    || Math.abs(xDiff) > 1
    || Math.abs(yDiff) > 1
  ) {
    pathDragIndicator.setAttribute('d', 'M0 0L0 0');
    return;
  }

  pathDragIndicator.style.transition = 'all.2s, scale.4s cubic-bezier(.5,2,.5,1)';
  pathDragIndicator.style.scale = 1;

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

  if (yurtInStartCell && !yurtInEndCell) {
    yurtInStartCell.rotateTo(cellX, cellY);
    dragStartCell = { x: cellX, y: cellY };
    yurtInStartCell.place();
    // pathDragIndicator.setAttribute('d', `M0 0L0 0`);
    pathDragIndicator.style.transition = '';
    return;
  } if (yurtInEndCell && !yurtInStartCell) {
    yurtInEndCell.rotateTo(dragStartCell.x, dragStartCell.y);
    // You can't drag through yurt because it was causing too many weird bugs
    dragStartCell = {};
    isDragging = false;
    yurtInEndCell.place();
    return;
  }

  if (yurtInStartCell && yurtInEndCell) {
    return;
  }

  // No paths check is done after yurt shenanigans
  if (inventory.paths <= 0) {
    pathDragIndicator.style.opacity = 0;
    dragStartCell = {};
    isDragging = false;
    return;
  }

  if (samePathInBothCell(dragStartCell.x, dragStartCell.y, cellX, cellY)) {
    gridPointerLayer.style.cursor = 'not-allowed';
    return;
  }

  const newPath = new Path({
    points: [
      { x: dragStartCell.x, y: dragStartCell.y },
      { x: cellX, y: cellY },
    ],
  });

  inventory.paths--;

  drawPaths({
    changedCells:
    [
      { x: dragStartCell.x, y: dragStartCell.y },
      { x: cellX, y: cellY },
    ],
    newPath,
  });

  dragStartCell = { x: cellX, y: cellY };
  pathDragIndicator.style.transition = '';
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
