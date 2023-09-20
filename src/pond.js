import { createSvgElement } from './svg-utils';
import { getOutlinePoints } from './hull';
import { pondLayer } from './layers';
import { gridCellSize } from './svg';

export const ponds = [];

const createPondShape = (width, height) => {
  const points = [];

  for (let h = -height / 2 + 0.5; h <= height / 2 - 0.5; h++) {
    for (let w = -width / 2 + 0.5; w <= width / 2 - 0.5; w++) {
      if (width / 2 - Math.abs(w) + Math.random() * 2 - 1 > Math.abs(h)) {
        points.push({ x: Math.floor(w), y: Math.floor(h) });
      }
    }
  }

  // If the number of points in the pond is bigger than 2, i.e. it's not
  // the weird visually broken 1x2 size pond, then return it
  if (points.length > 2) return points;

  // Else try again to make a nice pond shape
  return createPondShape(width, height);
};

export const spawnPond = ({
  width, height, x, y,
}) => {
  let points = createPondShape(width, height);
  const avoidancePoints = [];

  // Convert the points into world-space SVG grid points
  points = points.map((p) => ({
    x: x + p.x + Math.floor(width / 2),
    y: y + p.y + Math.floor(height / 2),
  }));

  // The entire width and height, not just the cells taken up by the point,
  // are to be avoided when generating new points, to avoid corner-y overlaps
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      avoidancePoints.push({
        x: x + w,
        y: y + h,
      });
    }
  }

  ponds.push({
    width, height, x, y, points, avoidancePoints,
  });

  const outline = getOutlinePoints(points);

  const pondSvg = createSvgElement('path');
  pondSvg.setAttribute('fill', '#69b');
  const d = outline.reduce((acc, curr, index) => {
    // const pondDot = createSvgElement('circle');
    // pondDot.style.transform = `translate(${x}px,${y}px)`;
    // pondDot.setAttribute('r', 1);
    // pondDot.setAttribute('fill', ['red', 'blue', 'green', 'yellow', 'black', 'white'][index]);
    // svgElement.append(pondDot);

    const next = outline.at((index + 1) % outline.length);
    // console.log(index % outline.length);
    const end = {
      x: curr.x + ((next.x - curr.x) / 2),
      y: curr.y + ((next.y - curr.y) / 2),
    };

    return `${acc} ${gridCellSize / 2 + curr.x * gridCellSize} ${gridCellSize / 2 + curr.y * gridCellSize} ${gridCellSize / 2 + end.x * gridCellSize} ${gridCellSize / 2 + end.y * gridCellSize}`;
  }, `M${gridCellSize / 2 + (outline[0].x + ((outline.at(-1).x - outline[0].x) / 2)) * gridCellSize} ${gridCellSize / 2 + (outline[0].y + ((outline.at(-1).y - outline[0].y) / 2)) * gridCellSize}Q`);

  pondSvg.setAttribute('d', `${d}Z`);
  pondSvg.setAttribute('stroke-width', 4);
  pondSvg.setAttribute('stroke-linejoin', 'round');
  pondSvg.setAttribute('stroke', '#6ab');

  const pondShadeSvg = createSvgElement('path');
  pondShadeSvg.setAttribute('fill', '#7bc');
  pondShadeSvg.setAttribute('d', `${d}Z`);
  pondShadeSvg.setAttribute('stroke', '#7bc');
  pondShadeSvg.style.filter = 'blur(2px)';

  const pondEdgeSvg = createSvgElement('path');
  pondEdgeSvg.setAttribute('d', `${d}Z`);
  pondEdgeSvg.setAttribute('stroke-width', 6);
  pondEdgeSvg.setAttribute('stroke', '#9b6');

  pondLayer.append(pondEdgeSvg, pondSvg, pondShadeSvg);
};
