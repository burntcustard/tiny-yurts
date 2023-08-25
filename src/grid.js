import { svgElement, boardOffsetX, boardOffsetY, boardWidth, boardHeight, boardSvgWidth, boardSvgHeight } from './svg';
import { colors } from './colors';

// Importing this doesn't work?
const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);


export const gridCellSize = 8; // Width & height of a cell, in SVG px

export const scaledGridLineThickness = 0.5;
export const gridLineThickness = scaledGridLineThickness / 2;

export const gridRect = createSvgElement('rect');
export const gridPointerHandler = createSvgElement('rect');

export const addGridToSvg = () => {
  // The entire games grid, including non-buildable area off the board
  const gridRectBackground = createSvgElement('rect');
  gridRectBackground.setAttribute('fill', colors.grass);
  gridRectBackground.setAttribute('width', `${boardSvgWidth + gridLineThickness}px`);
  gridRectBackground.setAttribute('height', `${boardSvgHeight + gridLineThickness}px`);
  gridRectBackground.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness} ${boardOffsetY * gridCellSize - gridLineThickness})`);

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
  gridRect.setAttribute('transform', `translate(${boardOffsetX * gridCellSize - gridLineThickness} ${boardOffsetY * gridCellSize - gridLineThickness})`)
  gridRect.setAttribute('fill', 'url(#grid)');

  svgElement.append(gridRectBackground, gridRect);
};

export const gridToSvgCoords = (object) => ({
  x: (boardOffsetX + object.x) * gridCellSize,
  y: (boardOffsetY + object.y) * gridCellSize,
});
