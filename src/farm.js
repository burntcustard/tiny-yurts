import { Structure } from './structure';
import { createSvgElement } from './svg';
import { gridBlockLayer, fenceLayer, fenceShadowLayer, pinLayer } from './layers';
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
    const { x, y, relativePathPoints } = properties;
    super(properties);
    this.demand = 0;
    this.totalUpdates = 0;
    this.circumference = this.width * gridCellSize * 2 + this.height * gridCellSize * 2;
    this.numIssues = 0;
    this.assignedPeople = [];
    this.points = [];

    for (let w = 0; w < this.width; w++) {
      for (let h = 0; h < this.height; h++) {
        this.points.push({ x: this.x + w, y: this.y + h });
      }
    }

    setTimeout(() => {
      // TODO: Make pathPoints a required variable?
      this.startPath = new Path({
        points: [
          {
            x: this.x + relativePathPoints?.[0]?.x,
            y: this.y + relativePathPoints?.[0]?.y,
          },
          {
            x: this.x + relativePathPoints?.[1]?.x,
            y: this.y + relativePathPoints?.[1]?.y
          },
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
    const adults = this.children.filter(c => !c.isBaby);
    const notWarnedAnimals = adults.filter(c => !c.hasWarn);
    const warnedAnimals = adults.filter(c => c.hasWarn);

    if (this.hasWarn) {
      if (this.numIssues <= adults.length) {
        this.hideWarn();
      } else {
        this.children.forEach(c => c.hideWarn());
      }
    } else {
      this.toggleWarn(this.numIssues > adults.length);

      if (this.numIssues < warnedAnimals.length) {
        warnedAnimals[Math.floor(Math.random() * warnedAnimals.length)].hideWarn();
      }

      if (notWarnedAnimals.length && this.numIssues > this.children.length - notWarnedAnimals.length) {
        notWarnedAnimals[Math.floor(Math.random() * notWarnedAnimals.length)].showWarn();
      }
    }
  }

  update() {
    // Don't actually update while the farm is transitioning-in
    if (this.appearing) return;

    this.numIssues = Math.floor(this.demand / this.needyness);
    this.demand += this.children.filter(c => !c.isBaby).length - 1;

    if (this.hasWarn) {
      this.updateWarn();
    }

    this.assignWarn();

    this.children.forEach((animal, i) => {
      animal.update();
    });

    for (let i = 0; i < this.numIssues; i++) {
      if (this.assignedPeople.length >= this.numIssues) return;
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
          to: this.points,
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
        this.assignedPeople.push(closestPerson);
        // animal.hasPerson = closestPerson;
        closestPerson.farmToVisit = this;
        // console.log('bestRoute');
        // console.log(bestRoute);
      } else {
        // console.log('no route found');

        // There's an animal that has no people of the same type waiting around at home that can come help
        // ... try again next update? (15 times/s)
      }
    }
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
    fence.setAttribute('stroke', this.fenceColor);
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

    this.pinSvg = createSvgElement('g');
    this.pinSvg.style.willChange = 'opacity, transform';
    this.pinSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1)';
    this.pinSvg.style.transformOrigin = 'bottom';
    this.pinSvg.style.transformBox = 'fill-box';
    this.pinSvg.style.opacity = 0;
    this.pinSvg.style.transform = `scale(0) translate(${x + svgWidth / 2}px, ${y + svgHeight / 2 + 1.5}px)`;
    pinLayer.appendChild(this.pinSvg);

    const pinBubble = createSvgElement('path');
    pinBubble.setAttribute('fill', '#fff');
    pinBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    pinBubble.setAttribute('transform', 'translate(-9 -9) scale(1.5)');
    this.pinSvg.appendChild(pinBubble);

    this.warnCircleBg = createSvgElement('circle');
    this.warnCircleBg.setAttribute('fill', 'none');
    this.warnCircleBg.setAttribute('stroke-width', '2');
    this.warnCircleBg.setAttribute('stroke-linecap', 'square'); // TODO: Remove parent
    this.warnCircleBg.setAttribute('r', 2);
    this.warnCircleBg.setAttribute('stroke', colors.ui);
    this.warnCircleBg.setAttribute('opacity', 0.2);
    this.warnCircleBg.setAttribute('transform', 'scale(1.2) translate(0 -5.3)');
    this.pinSvg.appendChild(this.warnCircleBg);

    this.warnCircle = createSvgElement('circle');
    this.warnCircle.setAttribute('fill', 'none');
    this.warnCircle.setAttribute('stroke-width', '2');
    this.warnCircle.setAttribute('stroke-linecap', 'butt'); // TODO: Remove parent
    this.warnCircle.setAttribute('r', 2);
    this.warnCircle.setAttribute('stroke', colors.red);
    this.warnCircle.style.willChange = 'stroke-dashoffset';
    this.warnCircle.style.transition = 'stroke-dashoffset.5s';
    this.warnCircle.setAttribute('stroke-dasharray', 12.56); // Math.PI * 4ish
    this.warnCircle.setAttribute('stroke-dashoffset', 12.56);
    this.warnCircle.style.transition = 'stroke-dashoffset.3s.1s';
    this.warnCircle.setAttribute('transform', 'scale(1.2) translate(0 -5.3) rotate(-90)');
    this.pinSvg.appendChild(this.warnCircle);

    this.pinSvg.style.opacity = 1;
  }

  showWarn() {
    const x = this.x * gridCellSize + fenceLineThickness / 2;
    const y = this.y * gridCellSize + fenceLineThickness / 2;
    const svgWidth = gridCellSize * this.width - fenceLineThickness - gridLineThickness;
    const svgHeight = gridCellSize * this.height - fenceLineThickness - gridLineThickness;

    this.hasWarn = true;
    this.pinSvg.style.opacity = 1;
    this.warnCircle.style.transition = 'stroke-dashoffset.4s.8s';
    this.pinSvg.style.transform = `translate(${x + svgWidth / 2}px, ${y + svgHeight / 2 + 1.5}px) scale(1)`;
    this.pinSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1)';
    setTimeout(() => {
      this.warnCircle.style.transition = 'stroke-dashoffset.4s';
    }, 1000);
  }

  hideWarn() {
    const x = this.x * gridCellSize + fenceLineThickness / 2;
    const y = this.y * gridCellSize + fenceLineThickness / 2;
    const svgWidth = gridCellSize * this.width - fenceLineThickness - gridLineThickness;
    const svgHeight = gridCellSize * this.height - fenceLineThickness - gridLineThickness;

    this.hasWarn = false;
    this.pinSvg.style.opacity = 0;
    this.warnCircle.style.transition = 'stroke-dashoffset.3s';
    this.pinSvg.style.transform = `translate(${x + svgWidth / 2}px, ${y + svgHeight / 2 + 1.5}px) scale(0)`;
    this.pinSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1) .4s';
  }

  toggleWarn(toggle) {
    if (toggle) {
      this.showWarn();
    } else {
      this.hideWarn();
    }
  }

  updateWarn() {
    const fullCircle = 12.56; // Math.PI * 4ish
    const maxOverflow = this.children.length + 1;
    const numOverflowIssues = this.numIssues - maxOverflow + 1;
    const dashoffset = fullCircle - (fullCircle / maxOverflow * numOverflowIssues);

    this.warnCircle.setAttribute('stroke-dashoffset', dashoffset);

    if (numOverflowIssues === maxOverflow) {
      this.isAlive = false;
    }
  }
}
