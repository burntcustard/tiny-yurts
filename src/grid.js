import {
  svgElement, boardOffsetX, boardOffsetY, boardSvgWidth, boardSvgHeight, gridCellSize,
} from './svg';
import { createSvgElement } from './svg-utils';
import { colors } from './colors';

export const scaledGridLineThickness = 1;
export const gridLineThickness = scaledGridLineThickness / 2;

export const gridRect = createSvgElement('rect');
export const gridRectRed = createSvgElement('rect');
export const gridPointerHandler = createSvgElement('rect');

export const addGridBackgroundToSvg = () => {
  const gridRectBackground = createSvgElement('rect');
  gridRectBackground.setAttribute('fill', colors.grass);
  gridRectBackground.setAttribute('width', `${boardSvgWidth + gridLineThickness}px`);
  gridRectBackground.setAttribute('height', `${boardSvgHeight + gridLineThickness}px`);
  gridRectBackground.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness / 2} ${boardOffsetY * gridCellSize - gridLineThickness / 2})`);

  svgElement.append(gridRectBackground);
}

export const addGridToSvg = () => {
  // The entire games grid, including non-buildable area off the board

  const defs = createSvgElement('defs');
  svgElement.appendChild(defs);

  const pattern = createSvgElement('pattern');
  pattern.setAttribute('id', 'grid'); // Required for defs, could maybe be minified
  pattern.setAttribute('width', gridCellSize);
  pattern.setAttribute('height', gridCellSize);
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  defs.appendChild(pattern);
  const gridPath = createSvgElement('path');
  gridPath.setAttribute('d', `M${gridCellSize} 0L0 0 0 ${gridCellSize}`);
  gridPath.setAttribute('fill', 'none');
  gridPath.setAttribute('stroke', colors.grid);
  gridPath.setAttribute('stroke-width', scaledGridLineThickness);
  pattern.appendChild(gridPath);
  gridRect.setAttribute('width', `${boardSvgWidth + gridLineThickness}px`);
  gridRect.setAttribute('height', `${boardSvgHeight + gridLineThickness}px`);
  gridRect.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness / 2} ${boardOffsetY * gridCellSize - gridLineThickness / 2})`);
  gridRect.setAttribute('fill', 'url(#grid)');
  gridRect.style.opacity = 0;
  gridRect.style.willChange = 'opacity';
  gridRect.style.transition = 'opacity.3s';

  const patternRed = createSvgElement('pattern');
  patternRed.setAttribute('id', 'gridred'); // Required for defs, could maybe be minified
  patternRed.setAttribute('width', gridCellSize);
  patternRed.setAttribute('height', gridCellSize);
  patternRed.setAttribute('patternUnits', 'userSpaceOnUse');
  defs.appendChild(patternRed);
  const gridPathRed = createSvgElement('path');
  gridPathRed.setAttribute('d', `M${gridCellSize} 0L0 0 0 ${gridCellSize}`);
  gridPathRed.setAttribute('fill', 'none');
  gridPathRed.setAttribute('stroke', colors.gridRed);
  gridPathRed.setAttribute('stroke-width', scaledGridLineThickness);
  patternRed.appendChild(gridPathRed);
  gridRectRed.setAttribute('width', `${boardSvgWidth + gridLineThickness}px`);
  gridRectRed.setAttribute('height', `${boardSvgHeight + gridLineThickness}px`);
  gridRectRed.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness / 2} ${boardOffsetY * gridCellSize - gridLineThickness / 2})`);
  gridRectRed.setAttribute('fill', 'url(#gridred)');
  gridRectRed.style.opacity = 0;
  gridRectRed.style.willChange = 'opacity';
  gridRectRed.style.transition = 'opacity.3s';

  svgElement.append(gridRect, gridRectRed);
};

export const gridToSvgCoords = (object) => ({
  x: (boardOffsetX + object.x) * gridCellSize,
  y: (boardOffsetY + object.y) * gridCellSize,
});
