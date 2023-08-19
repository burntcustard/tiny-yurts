import { GameObjectClass } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { pointerLayer } from './layers';

const padding = 3;

const getRandom = (range) =>
  padding + (Math.random() * (range * gridCellSize - padding * 2));

export class Animal extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
      x: getRandom(properties.parent?.width ?? 0),
      y: getRandom(properties.parent?.height ?? 0),
      rotation: properties.rotation ?? (Math.random() * Math.PI * 4) - Math.PI * 2,
    });
    this.isBaby = properties.isBaby ?? false;
    this.roundness = properties.roundness;
  }

  getRandomTarget() {
    const randomTarget = {
      x: getRandom(this.parent.width),
      y: getRandom(this.parent.height),
    };

    // const debug = createSvgElement('circle');
    // const x = this.parent.x * gridCellSize + randomTarget.x;
    // const y = this.parent.y * gridCellSize + randomTarget.y;
    // debug.setAttribute('transform', `translate(${x},${y})`);
    // debug.setAttribute('r', .5);
    // debug.setAttribute('fill', 'red');
    // pointerLayer.appendChild(debug);

    return randomTarget;
  }
}
