import { GameObjectClass } from 'kontra';
import { createSvgElement } from './svg';
import {
  yurtDecorationLayers, yurtLayer, yurtShadowLayer, pathLayer,
} from './layers';
import { gridCellSize } from './grid';

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

    // Similar to rotation, but is stored in x/y because it's easier for SVG & grid coords:
    this.direction = {
      x: 0,
      y: 1,
    };
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    const yurt = createSvgElement('circle');
    yurt.setAttribute('transform', `translate(${x},${y})`);
    yurt.style.transition = 'all.4s';
    yurtLayer.appendChild(yurt);

    const shadow = createSvgElement('path');
    shadow.setAttribute('stroke-width', '0');
    shadow.setAttribute('d', 'M0 0l0 0');
    shadow.setAttribute('transform', `translate(${x},${y})`);
    shadow.style.transition = 'stroke-width.4s,d.4s.3s';
    yurtShadowLayer.appendChild(shadow);

    const decoration = createSvgElement('circle');
    decoration.setAttribute('fill', 'none');
    decoration.setAttribute('r', 1);
    decoration.setAttribute('transform', `translate(${x},${y})`);
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

  addPath() {
    const path = createSvgElement('path'); // Convenient naming there
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;
    const relativePathX = this.direction.x * 4;
    const relativePathY = this.direction.y * 4;
    path.setAttribute('fill', 'none');
    path.setAttribute('d', `M${x} ${y}l${0} ${0}`);
    path.style.transition = 'all.5s';
    pathLayer.appendChild(path);

    setTimeout(() => {
      path.setAttribute('d', `M${x} ${y}l${relativePathX} ${relativePathY}`);
    }, 500);
  }
}
