import { GameObjectClass } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { colors } from './colors';
import { personLayer, personShadowLayer } from './layers';

export const people = [];

export class Person extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
    });

    this.type = this.parent.type;
    this.height = 1;
    this.width = 1;
    // Parent x/y is in grid coords instead of SVG coords, so need to convert
    this.x = gridCellSize / 2 + this.parent.x * gridCellSize;
    this.y = gridCellSize / 2 + this.parent.y * gridCellSize;

    // const x = this.parent.x * gridCellSize + this.x;
    // const y = this.parent.y * gridCellSize + this.y;
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
    personShadowLayer.appendChild(shadow);
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
    this.x += 0.01;
    this.y += 0.01;
  }
}
