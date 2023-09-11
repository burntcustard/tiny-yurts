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
svgContainerElement.style.overflow = 'hidden';
svgContainerElement.style.position = 'absolute';
svgContainerElement.style.width = '100vw';
svgContainerElement.style.height = '100vh';
svgContainerElement.style.backgroundColor = colors.grass;
svgContainerElement.style.display = 'grid';
svgContainerElement.style.placeItems = 'center';
document.body.append(svgContainerElement);

export const svgHazardLines = createElement();
svgHazardLines.style.position = 'absolute';
svgHazardLines.style.width = '100vw';
svgHazardLines.style.height = '100vh';
svgHazardLines.style.background = `repeating-linear-gradient(-55deg, ${colors.grid} 0 12px, #0000 0 24px)`;
svgHazardLines.style.opacity = 0;
svgHazardLines.style.willChange = 'opacity';
svgHazardLines.style.transition = 'opacity.3s';

export const svgHazardLinesRed = createElement();
svgHazardLinesRed.style.position = 'absolute';
svgHazardLinesRed.style.width = '100vw';
svgHazardLinesRed.style.height = '100vh';
svgHazardLinesRed.style.background = `repeating-linear-gradient(-55deg, currentColor 0 12px, #0000 0 24px)`;
svgHazardLinesRed.style.color = colors.gridRed;
svgHazardLinesRed.style.opacity = 0;
svgHazardLinesRed.style.willChange = 'opacity';
svgHazardLinesRed.style.transition = 'opacity.3s';

svgContainerElement.append(svgHazardLines, svgHazardLinesRed);

// Initial SVG element
export const svgElement = createSvgElement('svg');
svgElement.style.position = 'relative';
svgElement.setAttribute('viewBox', `0 0 ${gridSvgWidth} ${gridSvgHeight}`);
svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
svgElement.style.width = '100vw';
svgElement.style.height = '100vh';
svgElement.style.maxHeight = '68vw';
svgElement.style.maxWidth = '200vh';
svgElement.style.display = 'grid'; // Maybe required, cause of random extra px
svgElement.style.touchAction = 'none'; // Required to prevent default draggness
svgContainerElement.append(svgElement);
