import { createSvgElement, svgElement } from './svg';

export const gridSize = 8;

export const addGridToSvg = () => {
  const defs = createSvgElement('defs');
  svgElement.appendChild(defs);
  const pattern = createSvgElement('pattern');
  pattern.setAttribute('id', 'grid');
  pattern.setAttribute('width', 8);
  pattern.setAttribute('height', 8);
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  defs.appendChild(pattern);
  const gridPath = createSvgElement('path');
  gridPath.setAttribute('d', 'M8 0L0 0 0 8');
  gridPath.setAttribute('fill', 'none');
  gridPath.setAttribute('stroke', '#0001');
  gridPath.setAttribute('stroke-width', .5);
  pattern.appendChild(gridPath);
  const gridRect = createSvgElement('rect');
  gridRect.setAttribute('width', '100%');
  gridRect.setAttribute('height', '100%');
  gridRect.setAttribute('fill', 'url(#grid)');
  svgElement.appendChild(gridRect);
}
