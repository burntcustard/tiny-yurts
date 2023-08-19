import { colors } from './colors';

export const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

export const boardPxWidth = 384;
export const boardPxHeight = 384;
export const boardSvgWidth = 72;
export const boardSvgHeight = 72;
export const boardScale = boardPxWidth / boardSvgWidth;

// Initial SVG element
export const svgElement = createSvgElement('svg');
svgElement.setAttribute('width', boardPxWidth);
svgElement.setAttribute('height', boardPxHeight);
svgElement.setAttribute('viewBox', `0 0 ${boardSvgWidth} ${boardSvgHeight}`);
svgElement.setAttribute('stroke-linecap', 'round');
svgElement.style.display = 'grid'; // Maybe required, cause of random extra px
svgElement.style.touchAction = 'none'; // Required to prevent default draggness
svgElement.style.background = colors.grass;
document.body.appendChild(svgElement);
