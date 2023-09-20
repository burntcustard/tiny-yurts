import { GameObjectClass } from './modified-kontra/game-object';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import {
  gridBlockLayer, fenceLayer, fenceShadowLayer, pinLayer,
} from './layers';
import { gridLineThickness } from './grid';
import { Path, drawPaths } from './path';
import { colors } from './colors';
import { people } from './person';
import { findRoute } from './find-route';
import { playWarnNote } from './audio';

export const farms = [];

// TODO: Landscape and portrait fences? Square or circle fences?
const roundness = 2;
const fenceLineThickness = 1;

export class Farm extends GameObjectClass {
  constructor(properties) {
    const { relativePathPoints } = properties;
    super(properties);
    this.delay = this.delay ?? 0;
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

    if (relativePathPoints) {
      setTimeout(() => {
        // TODO: Make pathPoints a required variable?
        this.startPath = new Path({
          points: [
            {
              x: this.x + relativePathPoints[0].x,
              y: this.y + relativePathPoints[0].y,
              fixed: relativePathPoints[0].fixed,
              stone: relativePathPoints[0].stone,
            },
            {
              x: this.x + relativePathPoints[1].x,
              y: this.y + relativePathPoints[1].y,
              fixed: relativePathPoints[1].fixed,
              stone: relativePathPoints[1].stone,
            },
          ],
        });

        drawPaths({});
      }, 1500 + properties.delay); // Can't prevent path overlap soon after spawning due to this
    }

    farms.push(this);
    setTimeout(() => {
      this.addToSvg();
    }, properties.delay);
  }

  addAnimal(animal) {
    this.addChild(animal);
    animal.addToSvg();
  }

  assignWarn() {
    const adults = this.children.filter((c) => !c.isBaby);
    const notWarnedAnimals = adults.filter((c) => !c.hasWarn);
    const warnedAnimals = adults.filter((c) => c.hasWarn);

    if (this.hasWarn) {
      if (this.numIssues <= adults.length) {
        this.hideWarn();
      } else {
        this.children.forEach((c) => c.hideWarn());
      }
    } else {
      this.toggleWarn(this.numIssues > adults.length);

      if (warnedAnimals.length && this.numIssues < warnedAnimals.length) {
        warnedAnimals[Math.floor(Math.random() * warnedAnimals.length)].hideWarn();
      }

      if (notWarnedAnimals.length && this.numIssues > adults.length - notWarnedAnimals.length) {
        notWarnedAnimals[Math.floor(Math.random() * notWarnedAnimals.length)].showWarn();
      }
    }
  }

  update(gameStarted, updateCount) {
    // Don't actually update while the farm is transitioning-in
    if (this.appearing) return;

    if (gameStarted) {
      this.numIssues = Math.floor(this.demand / this.needyness);
      // this.demand += 20; // Extra demand for testing gameover screen etc.
      this.demand += (this.children.length - 1) + ((updateCount * updateCount) / 1e9);
      // console.log((this.children.length - 1) + ((updateCount * updateCount) / 1e9));

      if (this.hasWarn) {
        this.updateWarn();
      }

      this.assignWarn();
    }

    this.children.forEach((animal) => animal.update(gameStarted));

    for (let i = 0; i < this.numIssues; i++) {
      if (this.assignedPeople.length >= this.numIssues) return;
      // Find someone sitting around doing nothing
      const atHomePeopleOfSameType = people
        .filter((person) => person.atHome && person.type === this.type);

      if (atHomePeopleOfSameType.length === 0) return;

      // Assign whoever is closest to this farm, to this animal(?)
      let closestPerson = atHomePeopleOfSameType[0];

      let bestRoute = null;

      for (let j = 0; j < atHomePeopleOfSameType.length; j++) {
        const thisRoute = findRoute({
          from: {
            x: atHomePeopleOfSameType[j].parent.x,
            y: atHomePeopleOfSameType[j].parent.y,
          },
          to: this.points,
        });

        // If there is no current best route... this is faster than nothing!
        if (!bestRoute) {
          bestRoute = thisRoute;
          closestPerson = atHomePeopleOfSameType[j];
        }

        // If this persons route has fewer nodes, it's probably faster.
        if (thisRoute && thisRoute.length < bestRoute.length) {
          bestRoute = thisRoute;
          closestPerson = atHomePeopleOfSameType[j];
        }

        // If this persons route has the same number of nodes, but fewer diagonals?
        // Re-calculating these distances is not particularly costly, because
        // it's rare that two routes will have the exact same number of nodes
        if (thisRoute && thisRoute.length === bestRoute.length) {
          // If this person is from the same yurt as the other person don't check
          if (atHomePeopleOfSameType[j].parent !== closestPerson.parent) {
            const bestDistance = bestRoute.reduce((acc, curr) => acc + (curr.distance ?? 0), 0);
            const thisDistance = thisRoute.reduce((acc, curr) => acc + (curr.distance ?? 0), 0);

            if (thisDistance < bestDistance) {
              bestRoute = thisRoute;
              closestPerson = atHomePeopleOfSameType[j];
            }
          }
        }
      }

      if (bestRoute) {
        closestPerson.destination = bestRoute.at(-1);
        closestPerson.hasDestination = true;
        closestPerson.route = bestRoute;
        closestPerson.originalRoute = [...bestRoute];
        closestPerson.atHome = false; // Leave home!
        this.assignedPeople.push(closestPerson);
        closestPerson.farmToVisit = this;
      }
    }
  }

  render() {
    this.children.forEach((animal) => animal.render());
  }

  addToSvg() {
    const x = this.x * gridCellSize + fenceLineThickness / 2 + gridLineThickness / 2;
    const y = this.y * gridCellSize + fenceLineThickness / 2 + gridLineThickness / 2;
    const svgWidth = gridCellSize * this.width - fenceLineThickness - gridLineThickness;
    const svgHeight = gridCellSize * this.height - fenceLineThickness - gridLineThickness;

    if (this.type !== colors.fish) {
      const gridBlock = createSvgElement('rect');
      gridBlock.style.width = svgWidth;
      gridBlock.style.height = svgHeight;
      gridBlock.setAttribute('rx', roundness);
      gridBlock.setAttribute('transform', `translate(${x},${y})`);
      gridBlock.style.opacity = 0;
      gridBlock.style.transition = 'opacity.8s';
      gridBlock.style.willChange = 'opacity';
      gridBlock.setAttribute('fill', colors.grass);
      gridBlockLayer.append(gridBlock);
      setTimeout(() => gridBlock.style.opacity = 1, 1000);
      setTimeout(() => gridBlock.style.willChange = '', 2000);
    }

    const fence = createSvgElement('rect');
    fence.setAttribute('width', svgWidth);
    fence.setAttribute('height', svgHeight);
    fence.setAttribute('rx', roundness);
    fence.setAttribute('transform', `translate(${x},${y})`);
    fence.setAttribute('stroke', this.fenceColor);
    fence.setAttribute('stroke-dasharray', this.circumference); // Math.PI * 2 + a bit
    fence.setAttribute('stroke-dashoffset', this.circumference);
    fence.style.transition = `all 1s`;
    fenceLayer.append(fence);

    const shadow = createSvgElement('rect');
    // TODO: Landscape and portrait fences? Square or circle fences?
    shadow.setAttribute('width', svgWidth);
    shadow.setAttribute('height', svgHeight);
    shadow.setAttribute('rx', roundness);
    shadow.style.transform = `translate(${x - 0.5}px,${y - 0.5}px)`;
    shadow.style.willChange = 'stroke-dashoffset, transform';
    shadow.setAttribute('stroke-dasharray', this.circumference); // Math.PI * 2 + a bit
    shadow.setAttribute('stroke-dashoffset', this.circumference);
    shadow.style.transition = `stroke-dashoffset 1s, transform .5s`;
    fenceShadowLayer.append(shadow);

    setTimeout(() => {
      fence.setAttribute('stroke-dashoffset', 0);
      shadow.setAttribute('stroke-dashoffset', 0);
    }, 100);

    setTimeout(() => {
      shadow.style.transform = `translate(${x}px,${y}px)`;
    }, 1000);

    this.pinSvg = createSvgElement('g');
    this.pinSvg.translate = `${x + svgWidth / 2}px, ${y + svgHeight / 2 + 1.5}px`;
    this.pinSvg.style.willChange = `opacity, transform`;
    this.pinSvg.style.transition = `all .8s cubic-bezier(.5, 2, .5, 1)`;
    this.pinSvg.style.transformOrigin = 'bottom';
    this.pinSvg.style.transformBox = 'fill-box';
    this.pinSvg.style.opacity = 0;
    this.pinSvg.style.transform = `translate(${this.pinSvg.translate}) scale(0)`;
    pinLayer.append(this.pinSvg);

    this.pinBubble = createSvgElement('path');
    this.pinBubble.setAttribute('fill', '#fff');
    this.pinBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    this.pinBubble.setAttribute('transform', 'translate(-9 -9) scale(1.5)');
    this.pinSvg.append(this.pinBubble);

    this.warnCircleBg = createSvgElement('circle');
    this.warnCircleBg.setAttribute('fill', 'none');
    this.warnCircleBg.setAttribute('stroke-width', '2');
    this.warnCircleBg.setAttribute('stroke-linecap', 'square'); // TODO: Remove parent
    this.warnCircleBg.setAttribute('r', 2);
    this.warnCircleBg.setAttribute('stroke', colors.ui);
    this.warnCircleBg.setAttribute('opacity', 0.2);
    this.warnCircleBg.setAttribute('transform', 'scale(1.2) translate(0 -5.3)');
    this.pinSvg.append(this.warnCircleBg);

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
    this.pinSvg.append(this.warnCircle);

    this.pinSvg.style.opacity = 1;
  }

  showWarn() {
    this.hasWarn = true;
    this.pinSvg.style.opacity = 1;
    this.warnCircle.style.transition = 'stroke-dashoffset.4s.8s';
    this.pinSvg.style.transform = `translate(${this.pinSvg.translate}) scale(1)`;
    this.pinSvg.style.transition = `all .8s cubic-bezier(.5,2,.5,1)`;
    playWarnNote(this.type);

    setTimeout(() => {
      this.warnCircle.style.transition = 'stroke-dashoffset.4s';
    }, 1000);
  }

  hideWarn() {
    this.hasWarn = false;
    this.pinSvg.style.opacity = 0;
    this.warnCircle.style.transition = `stroke-dashoffset .3s`;
    this.pinSvg.style.transform = `translate(${this.pinSvg.translate}) scale(0)`;
    this.pinSvg.style.transition = `all .8s cubic-bezier(.5, 2, .5, 1) .4s`;
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
    const adults = this.children.filter((c) => !c.isBaby);
    const maxOverflow = adults.length * 2;
    const numOverflowIssues = this.numIssues - adults.length;
    const dashoffset = fullCircle - ((fullCircle / maxOverflow) * numOverflowIssues);

    this.warnCircle.setAttribute('stroke-dashoffset', dashoffset);

    if (this.prevNumOverflowIssues < numOverflowIssues) {
      playWarnNote(this.type);
      this.pinSvg.style.transform = `translate(${this.pinSvg.translate}) scale(1.2)`;

      setTimeout(() => {
        this.pinSvg.style.transform = `translate(${this.pinSvg.translate}) scale(1)`;
      }, 200);
    }

    this.prevNumOverflowIssues = numOverflowIssues;

    if (numOverflowIssues === maxOverflow) {
      this.isAlive = false;
    }
  }
}
