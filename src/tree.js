import { GameObjectClass } from 'kontra';
import { createSvgElement } from './svg-utils';
import { gridCellSize } from './svg';
import { yurtLayer, yurtAndPersonShadowLayer } from './layers';
import { colors } from './colors';

export const trees = [];

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

export class Tree extends GameObjectClass {
  constructor(properties) {
    super({ ...properties });

    this.points = [{
      x: this.x,
      y: this.y,
    }];

    trees.push(this);
    this.addToSvg();
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    this.svgGroup = createSvgElement('g');
    this.svgGroup.style.transform = `translate(${x}px,${y}px)`;
    yurtLayer.append(this.svgGroup);

    this.shadowGroup = createSvgElement('g');
    this.shadowGroup.style.transform = `translate(${x}px,${y}px)`;
    yurtAndPersonShadowLayer.append(this.shadowGroup);

    const numTrees = Math.random() * 3;

    for (let i = 0; i < numTrees; i++) {
      const xOffset = Math.random() * 8 - 4;
      const yOffset = Math.random() * 8 - 4;
      const size = Math.random() / 2 + 1;

      const circle = createSvgElement('circle');
      circle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      circle.setAttribute('fill', colors.leaf);
      circle.style.transition = 'r.4s';
      setTimeout(() => circle.setAttribute('r', size), 400 * i);

      this.svgGroup.append(circle);

      const shadow = createSvgElement('ellipse');
      shadow.setAttribute('stroke', 'none');
      shadow.setAttribute('rx', size * 1.2);
      shadow.setAttribute('ry', size * 0.9);
      shadow.style.opacity = 0.6;
      shadow.style.transform = `translate(${xOffset + size * 0.7}px,${yOffset + size * 0.7}px) rotate(45deg)`;
      shadow.setAttribute('fill', colors.black);
      this.shadowGroup.append(shadow);
    }

    // this.shadow = createSvgElement('path');
    // this.shadow.setAttribute('d', 'M0 0l0 0');
    // this.shadow.setAttribute('stroke-width', '6');
    // this.shadow.style.transform = `translate(${x}px,${y}px)`;
    // this.shadow.style.opacity = 0;
    // this.shadow.style.willChange = 'd';
    // this.shadow.style.transition = 'd.6s';
    // yurtAndPersonShadowLayer.append(this.shadow);
    // setTimeout(() => this.shadow.style.opacity = 0.8, 800);
    // setTimeout(() => this.shadow.setAttribute('d', 'M0 0l2 2'), 900);
    // setTimeout(() => this.shadow.style.willChange = '', 1600);

    // this.decoration = createSvgElement('circle');
    // this.decoration.setAttribute('fill', 'none');
    // this.decoration.setAttribute('r', 1);
    // this.decoration.setAttribute('stroke-dasharray', 6.3); // Math.PI * 2 + a bit
    // this.decoration.setAttribute('stroke-dashoffset', 6.3);
    // this.decoration.setAttribute('stroke', colors[this.type]);
    // this.decoration.style.willChange = 'stroke-dashoffset';
  }
}
