import { GameObjectClass } from './modified-kontra/game-object';
import { createSvgElement } from './svg-utils';
import { gridCellSize } from './svg';
import {
  baseLayer, yurtLayer, yurtAndPersonShadowLayer,
} from './layers';
import { Path, drawPaths, getPathsData } from './path';
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

export class Yurt extends GameObjectClass {
  constructor(properties) {
    const { x, y } = properties;

    super(properties);

    this.width = 1;
    this.height = 1;
    this.points = [{
      x: this.x,
      y: this.y,
    }];

    setTimeout(() => {
      this.startPath = new Path({
        points: [
          { x, y, fixed: true },
          { x: x + this.facing.x, y: y + this.facing.y },
        ],
      });

      drawPaths({
        changedCells: [
          { x, y, fixed: true },
          { x: x + this.facing.x, y: y + this.facing.y },
        ],
        noShadow: true,
      });
    }, 1000);

    setTimeout(() => {
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.forEach((p) => p.addToSvg());
    }, 2000);

    yurts.push(this);
    this.addToSvg();
  }

  rotateTo(x, y) {
    this.facing = {
      x: x - this.x,
      y: y - this.y,
    };

    const oldPathsInPathData = getPathsData().filter((p) => p.path === this.startPath
      || p.path1 === this.startPath
      || p.path2 === this.startPath);

    oldPathsInPathData.forEach((p) => {
      p.svgElement.setAttribute('stroke-width', 0);
      p.svgElement.setAttribute('opacity', 0);

      setTimeout(() => {
        p.svgElement.remove();
      }, 500);
    });

    // this.startPath.points[1] = { x: this.x, y: this.y };
    // console.log(this.startPath.points[1]);
    if (this.startPath) {
      this.oldStartPath = this.startPath;
      this.oldStartPath.noConnect = true;
    }

    // Add the new path
    this.startPath = new Path({
      points: [
        { x: this.x, y: this.y, fixed: true },
        { x, y },
      ],
    });

    // Redraw
    drawPaths({ changedCells: [{ x: this.x, y: this.y, fixed: true }, { x, y }], fadeout: true });

    // I think this slowed down the drawing of the path slightly but seems not needed
    // const pathInPathData = pathsData.find(p => p.path === this.startPath);
    // if (pathInPathData) {
    //   pathInPathData.svgElement.setAttribute('stroke-width', 0);
    //   setTimeout(() => {
    //     pathInPathData.svgElement.removeAttribute('stroke-width');
    //   }, 100);
    // }

    setTimeout(() => {
      // TODO: Figure it out if ? is necessary. Not having it it caused a crash once
      this.oldStartPath?.remove();
    }, 400);
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    const baseShadow = createSvgElement('circle');
    baseShadow.setAttribute('fill', colors.shade);
    baseShadow.setAttribute('r', 0);
    baseShadow.setAttribute('stroke', 'none');
    baseShadow.setAttribute('transform', `translate(${x},${y})`);
    baseShadow.style.willChange = `r, opacity`;
    baseShadow.style.opacity = 0;
    baseShadow.style.transition = `all .4s`;
    baseLayer.append(baseShadow);
    setTimeout(() => {
      baseShadow.setAttribute('r', 3);
      baseShadow.style.opacity = 1;
    }, 100);
    setTimeout(() => baseShadow.style.willChange = '', 600);

    this.svgGroup = createSvgElement('g');
    this.svgGroup.style.transform = `translate(${x}px,${y}px)`;
    yurtLayer.append(this.svgGroup);

    this.circle = createSvgElement('circle');
    this.circle.style.transition = 'r.4s';
    this.circle.style.willChange = 'r';
    setTimeout(() => this.circle.setAttribute('r', 3), 400);
    setTimeout(() => this.circle.style.willChange = '', 900);

    this.shadow = createSvgElement('path');
    this.shadow.setAttribute('d', 'M0 0 0 0');
    this.shadow.setAttribute('stroke-width', 6);
    this.shadow.style.transform = `translate(${x}px,${y}px)`;
    this.shadow.style.opacity = 0;
    this.shadow.style.willChange = 'd';
    this.shadow.style.transition = 'd.6s';
    yurtAndPersonShadowLayer.append(this.shadow);
    setTimeout(() => this.shadow.style.opacity = 0.8, 800);
    setTimeout(() => this.shadow.setAttribute('d', 'M0 0l2 2'), 900);
    setTimeout(() => this.shadow.style.willChange = '', 1600);

    this.decoration = createSvgElement('circle');
    this.decoration.setAttribute('fill', 'none');
    this.decoration.setAttribute('r', 1);
    this.decoration.setAttribute('stroke-dasharray', 6.3); // Math.PI * 2 + a bit
    this.decoration.setAttribute('stroke-dashoffset', 6.3);
    this.decoration.setAttribute('stroke', this.type);
    this.decoration.style.willChange = 'stroke-dashoffset';
    this.decoration.style.transition = `stroke-dashoffset .5s`;

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
