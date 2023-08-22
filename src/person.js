import { GameObjectClass } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { colors } from './colors';
import { farms } from './farm';
import { personLayer, yurtAndPersonShadowLayer } from './layers';

export const people = [];

export class Person extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
    });

    this.type = this.parent.type;
    this.height = 1;
    this.width = 1;
    this.atHome = true; // Is this person sitting in their yurt?
    this.atFarm = false; // Is this person currently at a farm?
    this.destination = null;
    // Parent x/y is in grid coords instead of SVG coords, so need to convert
    this.x = gridCellSize / 2 + this.parent.x * gridCellSize;
    this.y = gridCellSize / 2 + this.parent.y * gridCellSize;

    people.push(this);
  }

  addToSvg() {
    const x = this.x;
    const y = this.y;

    const person = createSvgElement('path');
    person.setAttribute('d', 'M0 0l0 0');
    person.setAttribute('transform', `translate(${x},${y})`);
    person.setAttribute('stroke', colors[this.type]);
    personLayer.appendChild(person);
    this.svgElement = person;

    const shadow = createSvgElement('path');
    shadow.setAttribute('d', 'M0 0l.3 .3');
    shadow.setAttribute('transform', `translate(${x},${y})`);
    yurtAndPersonShadowLayer.appendChild(shadow);
    this.shadowElement = shadow;
  }

  render() {
    if (!this.svgElement) return;

    const x = this.x;
    const y = this.y;

    this.svgElement.setAttribute('transform', `translate(${x},${y})`);
    this.shadowElement.setAttribute('transform', `translate(${x},${y})`);
  }

  update() {
    this.advance();

    // Figure out destination
    // if (this.atHome) {
    //   // Do any farms of the same type have issues that need addressing?
    //   const matchingFarmsWithDemand = farms.map(farm => farm.type === this.type && farm.numIssues);

    //   if (matchingFarmsWithDemand.length) {
    //     this.destination =
    //   }
    // }

    this.x += 0.01;
    this.y += 0.01;
  }
}
