import { createSvgElement } from './svg';
import { GameObjectClass } from 'kontra';
import { yurtDecorationLayers, yurtLayer, yurtShadowLayer } from './layers'
import { gridSize } from './grid';

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

export class Yurt extends GameObjectClass {
  constructor(properties) {
    super(properties);
    this.type = properties.type;
  }

  addToSvg() {
    const yurt = createSvgElement('circle');
    yurt.setAttribute('transform', `translate(${
      gridSize / 2 + this.x * gridSize},${gridSize / 2 + this.y * gridSize
    })`);
    yurt.style.transition = 'all.4s';
    yurtLayer.appendChild(yurt);

    const shadow = createSvgElement('path');
    shadow.setAttribute('stroke-width', '0');
    shadow.setAttribute('d', 'M0 0l0 0');
    shadow.setAttribute('transform', `translate(
      ${gridSize / 2 + this.x * gridSize},${gridSize / 2 + this.y * gridSize}
    )`);
    shadow.style.transition = 'stroke-width.4s,d.4s.3s';
    yurtShadowLayer.appendChild(shadow);

    const decoration = createSvgElement('circle');
    decoration.setAttribute('fill', 'none');
    decoration.setAttribute('r', 1);
    decoration.setAttribute('transform', `translate(
      ${gridSize / 2 + this.x * gridSize},${gridSize / 2 + this.y * gridSize}
    )`);
    decoration.setAttribute('stroke-dasharray', 6.3); // Math.PI * 2 + a bit
    decoration.setAttribute('stroke-dashoffset', 6.3);
    decoration.style.transition = 'all.5s.5s';
    yurtDecorationLayers[this.type].appendChild(decoration);

    // After a while, animate to real radius and shadow coords
    setTimeout(() => {
      yurt.setAttribute('r', 3);
      shadow.setAttribute('stroke-width', '6');
      shadow.setAttribute('d', 'M0 0l2 2');
      decoration.setAttribute('stroke-dashoffset', 0);
    }, 500);
  }

  draw() {
    // Do we add to SVG here?
  }
}
