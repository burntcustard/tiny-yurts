import { Structure } from './structure';
import { createSvgElement } from './svg';
import { gridBlockLayer, fenceLayer, fenceShadowLayer } from './layers';
import { gridCellSize, gridLineThickness } from './grid';
import { Path, drawPaths } from './path';
import { colors } from './colors';
import { Ox } from './ox';

export const farms = [];

// TODO: Landscape and portrait fences? Square or circle fences?
const roundness = 2;
const fenceLineThickness = 1;

export class Farm extends Structure {
  constructor(properties) {
    const { x, y } = properties;
    super(properties);
    this.width = 3;
    this.height = 2;
    this.circumference = this.width * gridCellSize * 2 + this.height * gridCellSize * 2;
    this.type = properties.type;
    farms.push(this);

    setTimeout(() => {
      this.startPath = new Path({
        points: [
          { x: x + 2, y: y + 1 },
          { x: x + 2, y: y + 2 },
        ],
      });

      drawPaths({});
    }, 1000)
  }

  addAnimal() {
    const animal = new Ox({
      parent: this,
    });
    this.addChild(animal);
    animal.addToSvg();
  }

  update() {
    this.children.forEach(ox => {
      // console.log('update ox');
      ox.update();
    });
  }

  render() {
    this.children.forEach(ox => {
      ox.render();
    })
  }

  addToSvg() {
    const x = this.x * gridCellSize + fenceLineThickness / 2 + gridLineThickness;
    const y = this.y * gridCellSize + fenceLineThickness / 2 + gridLineThickness;
    const svgWidth = gridCellSize * this.width - fenceLineThickness - gridLineThickness;
    const svgHeight = gridCellSize * this.height - fenceLineThickness - gridLineThickness;

    const gridBlock = createSvgElement('rect');
    gridBlock.setAttribute('width', svgWidth);
    gridBlock.setAttribute('height', svgHeight);
    gridBlock.setAttribute('rx', roundness);
    gridBlock.setAttribute('transform', `translate(${x},${y})`);
    gridBlock.style.opacity = 0;
    gridBlock.style.transition = 'all 1s';
    gridBlock.setAttribute('fill', colors.grass);
    gridBlockLayer.appendChild(gridBlock);
    setTimeout(() => gridBlock.style.opacity = 1, 500);

    const fence = createSvgElement('rect');
    fence.setAttribute('width', svgWidth);
    fence.setAttribute('height', svgHeight);
    fence.setAttribute('rx', roundness);
    fence.setAttribute('transform', `translate(${x},${y})`);
    fence.setAttribute('stroke-dasharray', this.circumference); // Math.PI * 2 + a bit
    fence.setAttribute('stroke-dashoffset', this.circumference);
    fence.style.transition = 'all 1s';
    fenceLayer.appendChild(fence);

    const shadow = createSvgElement('rect');
    // TODO: Landscape and portrait fences? Square or circle fences?
    shadow.setAttribute('width', svgWidth);
    shadow.setAttribute('height', svgHeight);
    shadow.setAttribute('rx', roundness);
    shadow.setAttribute('transform', `translate(${x},${y})`);
    shadow.setAttribute('stroke-dasharray', this.circumference); // Math.PI * 2 + a bit
    shadow.setAttribute('stroke-dashoffset', this.circumference);
    shadow.style.transition = 'all 1s';
    fenceShadowLayer.appendChild(shadow);

    // After a while, animate
    setTimeout(() => {
      fence.setAttribute('stroke-dashoffset', 0);
      shadow.setAttribute('stroke-dashoffset', 0);
    }, 500);
  }
}
