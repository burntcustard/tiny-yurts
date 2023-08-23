import { GameObjectClass, Vector } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { colors } from './colors';
import { personLayer, yurtAndPersonShadowLayer } from './layers';
import { findBestRoute } from './findBestRoute';
import { rotateVector } from './vector';

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
    this.atFarm = 0; // Is the person at a farm? How long have they been there?
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

    if (this.atHome || this.atFarm) {
      this.dx *= 0.9;
      this.dy *= 0.9;
      // TODO: Do this if at destination instead?
      // TODO: Set velocity to 0 when it gets little
    }

    // Is currently travelling?
    // could check velocity instead?
    const avoidanceDistance = 2;
    if (this.route?.length > 1) {
      people.forEach(otherPerson => {
        if (otherPerson === this) return false;
        if (otherPerson.position.distance(this.position) < avoidanceDistance) {
          const turnLeftVector = rotateVector(this.position, Math.PI / 2);
        }
      });
    }

    if (this.atFarm) {
      // Go back home... soon!
      this.atFarm++;

      // After this many updates, go home
      // TODO: Make sensible number, show some sort of animation
      if (this.atFarm > 60) {

        // Go back home. If no route is found, errrr dunno?
        const route = findBestRoute({
          from: {
            x: this.destination.x, // from before
            y: this.destination.y,
          },
          to: [{
            x: this.parent.x,
            y: this.parent.y,
          }],
        });

        if (route?.length) {
          this.goingHome = true;
          this.atFarm = 0;
          this.hasDestination = true;
          this.destination = route.at(-1);
          this.route = route;
        } else {
          // Can't find way home :(
        }
      }
    }

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

          const closeEnough = 2.3;
          const closeEnoughDestination = 2;

          if (this.route.length === 1) {
            if (
              Math.abs(this.x - firstRoutePoint.x) < closeEnoughDestination
              && Math.abs(this.y - firstRoutePoint.y) < closeEnoughDestination
            ) {
              if (this.goingHome) {
                // TODO: Have like 2 variables for atHome/atFarm/goingHome/goingFarm
                this.goingHome = false;
                this.atHome = true;
              } else {
                this.atFarm = 1;
                // TODO: get demand from animal or parent farm
                this.animalToVisit.parent.demand -= this.animalToVisit.parent.needyness;
                console.log(this.animalToVisit.parent.demand);
                this.animalToVisit.hideWarn();
                this.animalToVisit.hasPerson = false;
                // this.animalToVisit.hasWarn = false;
              }
              this.hasDestination = false;
              return;
            }
          } else {
            if (
              Math.abs(this.x - firstRoutePoint.x) < closeEnough
              && Math.abs(this.y - firstRoutePoint.y) < closeEnough
            ) {
              this.route.shift();
              return;
            }
          }

          // Usually < 10 loops with 0.1 and 0.98
          while (this.velocity.length() > 0.1) {
            this.dx *= 0.98;
            this.dy *= 0.98;
          }

          const allowedWonkyness = 0.006;
          const speed = 0.001;

          if (this.x < firstRoutePoint.x + allowedWonkyness) {
            this.dx += (firstRoutePoint.x - this.x) * speed;
          }
          if (this.x > firstRoutePoint.x - allowedWonkyness) {
            this.dx -= (this.x - firstRoutePoint.x) * speed;
          }

          if (this.y < firstRoutePoint.y + allowedWonkyness) {
            this.dy += (firstRoutePoint.y - this.y) * speed;
          }
          if (this.y > firstRoutePoint.y - allowedWonkyness) {
            this.dy -= (this.y - firstRoutePoint.y) * speed;
          }
          // console.log(firstRoutePoint);
        }
      }
    }
  }
}
