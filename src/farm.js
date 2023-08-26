import { Structure } from './structure';
import { createSvgElement } from './svg';
import { gridBlockLayer, fenceLayer, fenceShadowLayer } from './layers';
import { gridCellSize, gridLineThickness } from './grid';
import { Path, drawPaths } from './path';
import { colors } from './colors';
import { people } from './person';
import { findRoute } from './find-route';

export const farms = [];

// TODO: Landscape and portrait fences? Square or circle fences?
const roundness = 2;
const fenceLineThickness = 1;

export class Farm extends Structure {
  constructor(properties) {
    const { x, y } = properties;
    super(properties);
    this.circumference = this.width * gridCellSize * 2 + this.height * gridCellSize * 2;
    this.numIssues = 0;

    this.cells = [];

    for (let w = 0; w < this.width; w++) {
      for (let h = 0; h < this.height; h++) {
        this.cells.push({ x: this.x + w, y: this.y + h });
      }
    }

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

  assignWarn() {
    const notWarnedAnimals = this.children.filter(c => !c.hasWarn && !c.isBaby);

    if (notWarnedAnimals.length === 0) {
      // Go to the next panicy stage of aaaahhh all animals have a warning!
      // TODO: Figure out how this works with babies?
      return;
    }

    if (this.numIssues > this.children.length - notWarnedAnimals.length) {
      notWarnedAnimals[Math.floor(Math.random() * notWarnedAnimals.length)].showWarn();
    }
  }

  update() {
    // Don't actually update while the farm is transitioning-in
    if (this.appearing) return;

    this.numIssues = Math.floor(this.demand / this.needyness);
    this.demand += this.children.filter(c => !c.isBaby).length - 1;
    // console.log('numIssues:', this.numIssues, ', this.demand:', this.demand);

    this.assignWarn();

    this.children.forEach((animal, i) => {
      animal.update();
    });

    // For every animal with a warning pin (including love+warn at the same time)
    this.children.filter((animal) => animal.hasWarn && !animal.hasPerson).forEach((animal) => {
      // Find someone people sitting around doing nothing
      const atHomePeopleOfSameType = people.filter((person) => person.atHome && person.type === this.type);

      if (atHomePeopleOfSameType.length === 0) return;

      // Assign whoever is closest to this farm, to this animal(?)
      let closestPerson = atHomePeopleOfSameType[0];

      let bestRoute = null;

      for (let i = 0; i < atHomePeopleOfSameType.length; i++) {
        const thisPersonsRoute = findRoute({
          from: {
            x: atHomePeopleOfSameType[i].parent.x,
            y: atHomePeopleOfSameType[i].parent.y
          },
          to: this.cells,
        });

        if (!bestRoute
          || thisPersonsRoute && thisPersonsRoute.length < bestRoute.length
        ) {
          bestRoute = thisPersonsRoute;
          closestPerson = atHomePeopleOfSameType[i];
        }
      }

      if (bestRoute) {
        closestPerson.destination = bestRoute.at(-1);
        closestPerson.hasDestination = true;
        closestPerson.route = bestRoute;
        closestPerson.atHome = false; // Leave home!
        animal.hasPerson = closestPerson;
        closestPerson.animalToVisit = animal;
        // console.log('bestRoute');
        // console.log(bestRoute);
      } else {
        // console.log('no route found');

        // There's an animal that has no people of the same type waiting around at home that can come help
        // ... try again next update? (15 times/s)
      }
    });
  }

  render() {
    this.children.forEach(animal => {
      animal.render();
    });
  }

  addToSvg() {
    const x = this.x * gridCellSize + fenceLineThickness / 2;
    const y = this.y * gridCellSize + fenceLineThickness / 2;
    const svgWidth = gridCellSize * this.width - fenceLineThickness - gridLineThickness;
    const svgHeight = gridCellSize * this.height - fenceLineThickness - gridLineThickness;

    const gridBlock = createSvgElement('rect');
    gridBlock.setAttribute('width', svgWidth);
    gridBlock.setAttribute('height', svgHeight);
    gridBlock.setAttribute('rx', roundness);
    gridBlock.setAttribute('transform', `translate(${x},${y})`);
    gridBlock.style.opacity = 0;
    gridBlock.style.transition = 'opacity.8s';
    gridBlock.style.willChange = 'opacity';
    gridBlock.setAttribute('fill', colors.grass);
    gridBlockLayer.appendChild(gridBlock);
    setTimeout(() => gridBlock.style.opacity = 1, 1000);
    setTimeout(() => gridBlock.style.willChange = '', 2000);

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
