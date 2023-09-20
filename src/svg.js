import { colors } from './colors';
import { createSvgElement } from './svg-utils';
import { createElement } from './create-element';

export const gridCellSize = 8; // Width & height of a cell, in SVG px

// Offset of the buildable area inside the game board
// (this could change at the start of the game before zooming out?)
export const boardOffsetX = 3;
export const boardOffsetY = 2;

// Number of cells making up the width and height of the game board, only including buildable area
export const boardWidth = 20;
export const boardHeight = 10;

export const boardSvgWidth = boardWidth * gridCellSize;
export const boardSvgHeight = boardHeight * gridCellSize;

// Number of cells making up the width and height of the game board, including non-buildable area
export const gridWidth = boardOffsetX + boardWidth + boardOffsetX;
export const gridHeight = boardOffsetY + boardHeight + boardOffsetY;

export const gridSvgWidth = gridWidth * gridCellSize;
export const gridSvgHeight = gridHeight * gridCellSize;

export const scaledGridLineThickness = 0.5;
export const gridLineThickness = scaledGridLineThickness / 2;

export const svgContainerElement = createElement();
svgContainerElement.style.cssText = `
  position: absolute;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${colors.grass};
`;
svgContainerElement.style.width = '100vw';
svgContainerElement.style.height = '100vh';
document.body.append(svgContainerElement);

export const svgHazardLines = createElement();
// Inined grid color (#0001) to use fewer bytes
svgHazardLines.style.cssText = `
  position: absolute;
  display: grid;
  background: repeating-linear-gradient(-55deg, #0001 0 12px, #0000 0 24px);
`;
svgHazardLines.style.width = '100vw';
svgHazardLines.style.height = '100vh';
svgHazardLines.style.opacity = 0;
svgHazardLines.style.willChange = 'opacity';
svgHazardLines.style.transition = 'opacity.3s';

export const svgHazardLinesRed = createElement();
// Inlined gridRed color (#f002) to save a few bytes
svgHazardLinesRed.style.cssText = `
  position: absolute;
  display: grid;
  background: repeating-linear-gradient(-55deg, #f002 0 12px, #0000 0 24px);
`;
svgHazardLinesRed.style.width = '100vw';
svgHazardLinesRed.style.height = '100vh';
svgHazardLinesRed.style.opacity = 0;
svgHazardLinesRed.style.willChange = 'opacity';
svgHazardLinesRed.style.transition = `opacity .3s`;

svgContainerElement.append(svgHazardLines, svgHazardLinesRed);

// Initial SVG element
export const svgElement = createSvgElement();
// touch-action: none is required to prevent default draggness, probably
svgElement.style.cssText = `
  position: relative;
  display: grid;
  touch-action: none;
`;
svgElement.setAttribute('viewBox', `0 0 ${gridSvgWidth} ${gridSvgHeight}`);
svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
svgElement.style.width = '100vw';
svgElement.style.height = '100vh';
svgElement.style.maxHeight = '68vw';
svgElement.style.maxWidth = '200vh';
svgContainerElement.append(svgElement);

export const gridPointerLayer = createElement();
gridPointerLayer.style.cssText = `position: absolute`;
gridPointerLayer.style.width = `${(boardSvgWidth + gridLineThickness) * 8}px`;
gridPointerLayer.style.height = `${boardSvgHeight + gridLineThickness}px`;
gridPointerLayer.setAttribute(
  'transform',
  `translate(${boardOffsetX * gridCellSize - gridLineThickness} ${boardOffsetY * gridCellSize - gridLineThickness})`
);
gridPointerLayer.setAttribute('fill', 'none');
gridPointerLayer.style.cursor = 'cell';
gridPointerLayer.style.pointerEvents = 'all';
svgContainerElement.append(gridPointerLayer);
