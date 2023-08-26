import { createSvgElement } from './svg';
import { Structure } from './structure';
import {
  baseLayer, yurtDecorationLayers, yurtLayer, yurtAndPersonShadowLayer,
} from './layers';
import { gridCellSize } from './grid';
import { Path, drawPaths, pathsData } from './path';
import { colors } from './colors';
import { Person } from './person';

export const yurts = [];

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

export class Yurt extends Structure {
  constructor(properties) {
    const { x, y } = properties;

    super({
      ...properties,
      // connections: [
      //   { from: { x, y }, to: { x: x    , y: y - 1}, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y - 1}, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y    }, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x    , y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y    }, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y - 1}, object: null },
      // ],
    });

    this.type = properties.type;
    yurts.push(this);

    // Which way is the yurt facing (randomly up/down/left/right to start)
    // TODO: Less disguisting way to determine initial direction
    const facingInt = Math.floor(Math.random() * 4);
    if (facingInt < 0.25) {
      this.facing = { x: 0, y: -1 }
    } else if (facingInt < 0.5) {
      this.facing = { x: 1, y: 0 }
    } else if (facingInt < 0.75) {
      this.facing = { x: 0, y: 1 }
    } else {
      this.facing = { x: -1, y: 0 }
    }

    setTimeout(() => {
      this.startPath = new Path({
        points: [
          { x, y, fixed: true },
          { x: x + this.facing.x, y: y + this.facing.y },
        ],
      });

      drawPaths({ changedCells: [
        { x, y, fixed: true },
        { x: x + this.facing.x, y: y + this.facing.y }
      ]});
    }, 1000)

    setTimeout(() => {
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.forEach(p => p.addToSvg());
    }, 2000);
  }

  rotateTo(x, y) {
    this.facing = {
      x: x - this.x,
      y: y - this.y,
    };

    const oldPathsInPathData = pathsData.filter(p =>
      p.path === this.startPath ||
      p.path1 === this.startPath ||
      p.path2 === this.startPath
    );

    oldPathsInPathData.forEach(p => {
      p.svgElement.setAttribute('stroke-width', 0);
      p.svgElement.setAttribute('opacity', 0);

      setTimeout(() => {
        p.svgElement.remove();
      }, 500);
    });

    // this.startPath.points[1] = { x: this.x, y: this.y };
    // console.log(this.startPath.points[1]);
    this.oldStartPath = this.startPath;
    this.oldStartPath.noConnect = true;

    // Add the new path
    this.startPath = new Path({
      points: [
        { x: this.x, y: this.y, fixed: true },
        { x, y },
      ],
    });

    // Redraw
    drawPaths({ changedCells: [{ x: this.x, y: this.y, fixed: true }, { x, y }], fadeout: true });

    const pathInPathData = pathsData.find(p => p.path === this.startPath);

    if (pathInPathData) {
      pathInPathData.svgElement.setAttribute('stroke-width', 0);

      setTimeout(() => {
        pathInPathData.svgElement.removeAttribute('stroke-width');
      }, 100);
    }

    setTimeout(() => {
      this.oldStartPath.remove();
    }, 400);
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    const baseShadow = createSvgElement('circle');
    baseShadow.setAttribute('fill', colors.shade);
    baseShadow.setAttribute('r', 0)
    baseShadow.setAttribute('stroke', 'none');
    baseShadow.setAttribute('transform', `translate(${x},${y})`);
    baseShadow.style.willChange = 'r, opacity';
    baseShadow.style.opacity = 0;
    baseShadow.style.transition = 'all.4s';
    baseLayer.appendChild(baseShadow);
    setTimeout(() => {
      baseShadow.setAttribute('r', 3);
      baseShadow.style.opacity = 1;
    }, 100);
    setTimeout(() => baseShadow.style.willChange = '', 600);

    this.svgGroup = createSvgElement('g');
    this.svgGroup.style.transform = `translate(${x}px,${y}px)`;
    yurtLayer.appendChild(this.svgGroup);

    this.circle = createSvgElement('circle');
    this.circle.style.transition = 'r.4s';
    this.circle.style.willChange = 'r';
    setTimeout(() => this.circle.setAttribute('r', 3), 400);
    setTimeout(() => this.circle.style.willChange = '', 900);

    this.shadow = createSvgElement('path');
    this.shadow.setAttribute('d', 'M0 0l0 0');
    this.shadow.setAttribute('stroke-width', '6');
    this.shadow.style.transform = `translate(${x}px,${y}px)`;
    this.shadow.style.opacity = 0;
    this.shadow.style.willChange = 'd';
    this.shadow.style.transition = 'd.6s';
    yurtAndPersonShadowLayer.appendChild(this.shadow);
    setTimeout(() => this.shadow.style.opacity = 1, 800);
    setTimeout(() => this.shadow.setAttribute('d', 'M0 0l2 2'), 900);
    setTimeout(() => this.shadow.style.willChange = '', 1600);

    this.decoration = createSvgElement('circle');
    this.decoration.setAttribute('fill', 'none');
    this.decoration.setAttribute('r', 1);
    this.decoration.setAttribute('stroke-dasharray', 6.3); // Math.PI * 2 + a bit
    this.decoration.setAttribute('stroke-dashoffset', 6.3);
    this.decoration.setAttribute('stroke', colors[this.type]);
    this.decoration.style.willChange = 'stroke-dashoffset';
    this.decoration.style.transition = 'stroke-dashoffset .5s';

    this.svgGroup.append(this.circle, this.decoration);

    setTimeout(() => this.decoration.setAttribute('stroke-dashoffset', 0), 700);
    setTimeout(() => this.decoration.style.willChange = '', 1300);
  }

  lift() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    this.shadow.style.transition = 'transform.2s d.3s';
    this.shadow.setAttribute('d', 'M0 0l3 3');

    this.svgGroup.style.transition = 'transform.2s';
    this.svgGroup.style.transform = `translate(${x}px,${y}px) scale(1.1)`;
  }

  place() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    this.shadow.style.transition = 'transform.3s d.4s';
    this.shadow.setAttribute('d', 'M0 0l2 2');
    this.shadow.style.transform = `translate(${x}px,${y}px) scale(1)`;

    this.svgGroup.style.transition = 'transform.3s';
    this.svgGroup.style.transform = `translate(${x}px,${y}px) scale(1)`;
  }
}
