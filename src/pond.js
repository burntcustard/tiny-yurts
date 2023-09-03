import { createSvgElement } from './svg-utils';
import { hull } from './hull';
import { pondLayer } from './layers';
import { svgElement } from './svg';
import {
  boardOffsetX, boardOffsetY, gridCellSize, boardWidth, boardHeight
} from './svg';
import { colors } from './colors';

export const ponds = [];

export const spawnPond = ({ width, height, x, y }) => {
  let points = [];
  let avoidancePoints = [];

  for (let y = -height / 2 + 0.5; y <= height / 2 - 0.5; y++) {
    for (let x = -width / 2 + 0.5; x <= width / 2 - 0.5; x++) {
      if (width / 2 - Math.abs(x) + Math.random() * 2 - 1 > Math.abs(y)) {
        points.push({ x: Math.floor(x), y: Math.floor(y) });
      }
    }
  }

  points = points.map((p) => ({
    x: x + p.x + Math.floor(width / 2),
    y: y + p.y + Math.floor(height / 2),
  }));

  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      avoidancePoints.push({
        x: x + w,
        y: y + h,
      });
    }
  }

  ponds.push({width, height, x, y, points, avoidancePoints});

  const outline = hull(points);

  const pondSvg = createSvgElement('path');
  // pondSvg.setAttribute('fill', '#7ae9');
  pondSvg.setAttribute('fill', '#69b');
  const d = outline.reduce((acc, curr, index) => {
    const x = curr.x * gridCellSize;
    const y = curr.y * gridCellSize;

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

  pondSvg.setAttribute('d', d + 'Z');
  pondSvg.setAttribute('stroke-width', 4);
  pondSvg.setAttribute('stroke-linejoin', 'round');
  // pondSvg.setAttribute('stroke', '#fae9');
  pondSvg.setAttribute('stroke', '#69b');
  // console.log(pondSvg.getAttribute('d'));
  // console.log(pondSvg);

  const pondShadeSvg = createSvgElement('path');
  pondShadeSvg.setAttribute('fill', '#7ac');
  // sandSvg.setAttribute('stroke', '#f00');
  pondShadeSvg.setAttribute('d', d + 'Z');
  pondShadeSvg.setAttribute('stroke-width', 1);
  pondShadeSvg.setAttribute('stroke', '#7ac');
  pondShadeSvg.style.filter = 'blur(2px)';

  const pondSandSvg = createSvgElement('path');
  // pondSandSvg.setAttribute('fill', '');
  pondSandSvg.setAttribute('d', d + 'Z');
  pondSandSvg.setAttribute('stroke-width', 6);
  pondSandSvg.setAttribute('stroke', '#9b6');

  pondLayer.append(pondSandSvg, pondSvg, pondShadeSvg);
};
