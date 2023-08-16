import { createSvgElement, svgElement } from './svg';
import { colors } from './colors';

export const gridCellSize = 8; // In SVG scale
export const scaledGridLineThickness = 0.5;
export const gridLineThickness = scaledGridLineThickness / 2;

export const addGridToSvg = () => {
  const defs = createSvgElement('defs');
  svgElement.appendChild(defs);
  const pattern = createSvgElement('pattern');
  pattern.setAttribute('id', 'grid');
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
  const gridRect = createSvgElement('rect');
  gridRect.setAttribute('width', '100%');
  gridRect.setAttribute('height', '100%');
  gridRect.setAttribute('fill', 'url(#grid)');
  svgElement.appendChild(gridRect);
};
