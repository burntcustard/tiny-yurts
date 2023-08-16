import { createSvgElement } from './svg';
import { GameObjectClass } from 'kontra';
import { fenceLayer, fenceShadowLayer } from './layers'
import { gridSize } from './grid';
import { Ox } from './animal';

// TODO: Landscape and portrait fences? Square or circle fences?
const width = 3;
const height = 2;
const circumference = width * gridSize * 2 + height * gridSize * 2;

export class Farm extends GameObjectClass {
  constructor(properties) {
    super(properties);
    this.type = properties.type;
    this.animals = [];
  }

  addAnimal() {
    const animal = new Ox({
      x: 2 + (Math.random() * (width * gridSize - 4)),
      y: 2 + (Math.random() * (height * gridSize - 4)),
      parent: this,
      rotation: Math.random() * Math.PI * 4
    });
    this.animals.push(animal);
    this.children.push(animal);
    animal.addToSvg();
  }

  addToSvg() {
    const fence = createSvgElement('rect');
    fence.setAttribute('width', gridSize * width);
    fence.setAttribute('height', gridSize * height);
    fence.setAttribute('rx', 2);
    fence.setAttribute('transform', `translate(${
      this.x * gridSize},${this.y * gridSize
    })`);
    fence.setAttribute('stroke-dasharray', circumference); // Math.PI * 2 + a bit
    fence.setAttribute('stroke-dashoffset', circumference);
    fence.style.transition = 'all.9s';
    fenceLayer.appendChild(fence);

    const shadow = createSvgElement('rect');
    // TODO: Landscape and portrait fences? Square or circle fences?
    shadow.setAttribute('width', gridSize * 3);
    shadow.setAttribute('height', gridSize * 2);
    shadow.setAttribute('rx', 2);
    shadow.setAttribute('transform', `translate(${
      this.x * gridSize},${this.y * gridSize
    })`);
    shadow.setAttribute('stroke-dasharray', circumference); // Math.PI * 2 + a bit
    shadow.setAttribute('stroke-dashoffset', circumference);
    shadow.style.transition = 'all.9s';
    fenceShadowLayer.appendChild(shadow);

    // After a while, animate
    setTimeout(() => {
      fence.setAttribute('stroke-dashoffset', 0);
      shadow.setAttribute('stroke-dashoffset', 0);
    }, 500);
  }

  draw() {
    // Do we add to SVG here?
  }
}
