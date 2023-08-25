import { colors } from './colors';

import { gridCellSize } from './grid';

export const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

// The offset of the buildable area inside the game board
// (this could change at the start of the game before zooming out?)
export const boardOffsetX = 3;
export const boardOffsetY = 2;

// The number of cells making up the width and height of the game board, only including buildable area
export const boardWidth = 22;
export const boardHeight = 11;

export const boardSvgWidth = boardWidth * gridCellSize;
export const boardSvgHeight = boardHeight * gridCellSize;

// The number of cells making up the width and height of the game board, including non-buildable area
export const gridWidth = boardOffsetX + boardWidth + boardOffsetX;
export const gridHeight = boardOffsetY + boardHeight + boardOffsetY;

export const gridSvgWidth = gridWidth * gridCellSize;
export const gridSvgHeight = gridHeight * gridCellSize;

export const scaledGridLineThickness = 0.5;
export const gridLineThickness = scaledGridLineThickness / 2;

const svgContainerElement = document.createElement('div');
svgContainerElement.style.background = `repeating-linear-gradient(-55deg, ${colors.grid} 0 12px,#0000 0 24px)`;
svgContainerElement.style.backgroundColor = colors.grass;
svgContainerElement.style.width = '100dvw';
svgContainerElement.style.height = '100dvh';
svgContainerElement.style.display = 'grid';
svgContainerElement.style.placeItems = 'center';
document.body.append(svgContainerElement);

// Initial SVG element
export const svgElement = createSvgElement('svg');
svgElement.setAttribute('viewBox', `0 0 ${gridSvgWidth} ${gridSvgHeight}`);
svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
svgElement.style.width = '100dvw';
svgElement.style.height = '100dvh';
svgElement.style.maxHeight = '65dvw';
svgElement.style.maxWidth = '200dvh';
svgElement.style.display = 'grid'; // Maybe required, cause of random extra px
svgElement.style.touchAction = 'none'; // Required to prevent default draggness
svgContainerElement.append(svgElement);
