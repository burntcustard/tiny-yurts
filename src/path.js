import { GameObjectClass } from 'kontra';
import { createSvgElement } from './svg';
import { pathLayer } from './layers';
import { gridCellSize } from './grid';

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

export const pathSvgWidth = 3;

const toSvgCoord = (c) => gridCellSize / 2 + c * gridCellSize;

export class Path extends GameObjectClass {
  constructor(properties) {
    super(properties);
    this.start = properties.start;
    this.end = properties.end;
    this.svgElement = createSvgElement('path');
    this.points = [];
  }

  drawSvg() {
    // Start and end match, actually just draw a circle
    // if (this.start.x === this.end.x && this.start.y === this.start.y) {
    //   this.svgElement = createSvgElement('circle');
    //   this.svgElement.setAttribute('fill', colors.path);
    // }
    const x = toSvgCoord(this.x);
    const y = toSvgCoord(this.y);
    this.svgElement.setAttribute('d', `M${x} ${y} L${x} ${y} ${this.points.reduce((p, i) => i > 0 ? `L${toSvgCoord(p.x)} ${toSvgCoord(p.y)}` : '', '')}`);

    for (let index = 0; index < this.points.length; index++) {
      setTimeout(() => {
        this.svgElement.setAttribute('d', `M${x} ${y} ${this.points.reduce((p, i) => `L${i < index ? toSvgCoord(p.x) : x} ${toSvgCoord(p.y)}`, '')}`);
      }, 500 * index);
    }
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;
    this.svgElement.setAttribute('fill', 'none');
    this.svgElement.setAttribute('d', this.d);
    this.svgElement.setAttribute('stroke-width', 0);
    this.svgElement.style.transition = 'all.3s';
    pathLayer.appendChild(this.svgElement);

    // After a while, animate to real radius and shadow coords
    setTimeout(() => {
      this.svgElement.setAttribute('stroke-width', pathSvgWidth);
    });

    this.drawSvg();
  }

  addPoint({ x, y }) {
    this.points.push({ x, y });
    this.drawSvg();
  }
}
