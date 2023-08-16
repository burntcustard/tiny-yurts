export const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

// Initial SVG element
export const svgElement = createSvgElement('svg');
svgElement.setAttribute('width', 384);
svgElement.setAttribute('height', 384);
svgElement.setAttribute('viewBox', '0 0 72 72');
svgElement.style.cssText = 'background:#8a5';
document.body.appendChild(svgElement);
