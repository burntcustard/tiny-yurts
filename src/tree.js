import { Vector } from 'kontra';
import { GameObjectClass } from './modified-kontra/game-object';
import { createSvgElement } from './svg-utils';
import { gridCellSize } from './svg';
import { treeShadowLayer, treeLayer } from './layers';
import { colors } from './colors';
import { playTreeDeleteNote } from './audio';

export const trees = [];

export class Tree extends GameObjectClass {
  constructor(properties) {
    super({ ...properties });

    trees.push(this);
    this.dots = [];
    this.addToSvg();
  }

  addToSvg() {
    const minDotGap = 0.5;
    const numTrees = Math.random() * 4;
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    this.svgGroup = createSvgElement('g');
    this.svgGroup.style.transform = `translate(${x}px,${y}px)`;
    treeLayer.append(this.svgGroup);

    this.shadowGroup = createSvgElement('g');
    this.shadowGroup.style.transform = `translate(${x}px,${y}px)`;
    treeShadowLayer.append(this.shadowGroup);

    for (let i = 0; i < numTrees; i++) {
      const size = Math.random() / 2 + 1;
      const position = new Vector(Math.random() * 8 - 4, Math.random() * 8 - 4);

      // If this new tree (...branch) is too close to another tree in this cell, just skip it.
      // This means that on average, larger trees are less likely to have many siblings
      if (this.dots.some((d) => d.position.distance(position) < d.size + size + minDotGap)) {
        continue;
      }

      this.dots.push({ position, size });

      const circle = createSvgElement('circle');
      circle.style.transform = `translate(${position.x}px, ${position.y}px)`;
      circle.setAttribute('fill', colors.leaf);
      circle.style.transition = `r .4s cubic-bezier(.5, 1.5, .5, 1)`;
      setTimeout(() => circle.setAttribute('r', size), 100 * i);

      this.svgGroup.append(circle);

      const shadow = createSvgElement('ellipse');
      shadow.setAttribute('rx', 0);
      shadow.setAttribute('ry', 0);
      shadow.style.opacity = 0;
      shadow.style.transform = `translate(${position.x}px,${position.y}px) rotate(45deg)`;
      shadow.style.transition = `all .4s cubic-bezier(.5, 1.5, .5, 1)`;
      setTimeout(() => {
        shadow.setAttribute('rx', size * 1.2);
        shadow.setAttribute('ry', size * 0.9);
        shadow.style.opacity = 0.1;
        shadow.style.transform = `translate(${position.x + size * 0.7}px,${position.y + size * 0.7}px) rotate(45deg)`;
      }, 100 * i);
      this.shadowGroup.append(shadow);
    }
  }

  remove() {
    // Remove from the SVG
    this.svgGroup.remove();
    this.shadowGroup.remove();

    for (let i = 0; i < this.dots.length; i++) {
      setTimeout(() => playTreeDeleteNote(), i * 100);
    }

    // Remove from trees array
    trees.splice(trees.findIndex((p) => p === this), 1);
  }
}
