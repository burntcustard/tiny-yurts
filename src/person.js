import { GameObjectClass, Vector } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { colors } from './colors';
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

    // If the person has a destination, gotta follow the route to it!
    // TODO: We have 3 variables for kinda the same thing but maybe we need them
    if (this.hasDestination) {
      if (this.destination) {
        if (this.route?.length) {
          // Head to the first point in the route, and then... remove it when we get there?
          const firstRoutePoint = new Vector(
            gridCellSize / 2 + this.route[0].x * gridCellSize,
            gridCellSize / 2 + this.route[0].y * gridCellSize,
          );
          // console.log(firstRoutePoint);
        }
      }
    }

    this.x += 0.01;
    this.y += 0.01;
  }
}
