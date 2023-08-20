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
    this.circumference = this.width * gridCellSize * 2 + this.height * gridCellSize * 2;
    this.type = properties.type;
    this.numIssues = 0;

    setTimeout(() => {
      this.startPath = new Path({
        points: [
          { x: x + 2, y: y + 1 },
          { x: x + 2, y: y + 2 },
        ],
      });

      drawPaths({});
    }, 1500)

    farms.push(this);

    this.addToSvg();
  }

  addAnimal(animal) {
    this.addChild(animal);
    animal.addToSvg();
  }

  upgrade() {
    const parent1 = this.children.at(-1);
    const parent2 = this.children.at(-2);
    const parent3 = this.children.at(-3);
    parent1.showLove();
    setTimeout(() => parent2.showLove(), 1000);
    setTimeout(() => parent3.showLove(), 2000);

    setTimeout(() => {
      parent1.hideLove();
      parent2.hideLove();
      parent3.hideLove();
    }, 7000);

    setTimeout(() => this.addAnimal({ isBaby: true }), 8000);
    setTimeout(() => this.addAnimal({ isBaby: true }), 9000);
  }

  update() {
    this.children.forEach((animal, i) => {
      if (i < this.numIssues) {
        animal.showWarn();
      } else {
        animal.removeWarn();
      }

      animal.update();
    });
  }

  render() {
    this.children.forEach(animal => {
      animal.render();
    });
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
    gridBlock.style.transition = 'opacity 1s';
    gridBlock.style.willChange = 'opacity';
    gridBlock.setAttribute('fill', colors.grass);
    gridBlockLayer.appendChild(gridBlock);
    setTimeout(() => gridBlock.style.opacity = 1, 1000);

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
    shadow.style.transform = `translate(${x - 0.5}px,${y - 0.5}px)`;
    shadow.style.willChange = 'stroke-dashoffset, transform';
    shadow.setAttribute('stroke-dasharray', this.circumference); // Math.PI * 2 + a bit
    shadow.setAttribute('stroke-dashoffset', this.circumference);
    shadow.style.transition = 'stroke-dashoffset 1s,transform.5s';
    fenceShadowLayer.appendChild(shadow);

    setTimeout(() => {
      fence.setAttribute('stroke-dashoffset', 0);
      shadow.setAttribute('stroke-dashoffset', 0);
    }, 100);

    setTimeout(() => {
      shadow.style.transform = `translate(${x}px,${y}px)`;
    }, 1000);
  }
}
