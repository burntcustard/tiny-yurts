import { createSvgElement } from './svg';
import { GameObjectClass, radToDeg } from 'kontra';
import { animalLayer, animalShadowLayer } from './layers'
import { gridSize } from './grid';

export class Animal extends GameObjectClass {
  constructor(properties) {
    super(properties);
  }
}

export class Ox extends Animal {
  constructor(properties) {
    super(properties);
  }

  width = 1.5;
  height = 2.5;

  addToSvg() {
    const ox = createSvgElement('rect');
    const x = this.parent.x * gridSize + this.x - this.width / 2;
    const y = this.parent.y * gridSize + this.y - this.height / 2;
    ox.setAttribute('transform', `translate(${x},${y}) rotate(${radToDeg(this.rotation)})`);
    ox.setAttribute('fill', '#b75');
    ox.setAttribute('width', this.width);
    ox.setAttribute('height', this.height);
    ox.setAttribute('rx', .6);
    ox.style.transformOrigin = 'center';
    ox.style.transformBox = 'fill-box';
    ox.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${radToDeg(this.rotation)}deg)
      scale(0)
    `;
    // ox.style.scale = 0;
    ox.style.transition = 'all 1s';
    animalLayer.appendChild(ox);

    const shadow = createSvgElement('rect');
    shadow.setAttribute('fill', '#0002');
    shadow.setAttribute('width', 1.5);
    shadow.setAttribute('height', 2.5);
    shadow.setAttribute('rx', .6);
    shadow.style.transformOrigin = 'center';
    shadow.style.transformBox = 'fill-box';
    shadow.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${radToDeg(this.rotation)}deg)
      scale(0)
    `;
    shadow.style.transition = 'all 1s';
    animalShadowLayer.appendChild(shadow);

    setTimeout(() => {
      ox.style.transform = `
        translate(${x}px, ${y}px)
        rotate(${radToDeg(this.rotation)}deg)
        scale(1)
      `;
      shadow.style.transform = `
        translate(${x}px, ${y}px)
        rotate(${radToDeg(this.rotation)}deg)
        scale(1)
      `;
    }, 100);
  }
}
