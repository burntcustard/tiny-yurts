import { Vector } from 'kontra';
import { GameObjectClass } from './modified-kontra/game-object';
import { createSvgElement } from './svg-utils';
import { gridCellSize } from './svg';
import { colors } from './colors';
import { personLayer, yurtAndPersonShadowLayer } from './layers';
import { findRoute } from './find-route';
import { rotateVector, combineVectors } from './vector';
import { shuffle } from './shuffle';

export const people = [];

export class Person extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
    });

    const xVariance = Math.random() * 2 - 1;
    const yVariance = Math.random() * 2 - 1;

    this.type = this.parent.type;
    this.atHome = true; // Is this person sitting in their yurt?
    this.atFarm = 0; // Is the person at a farm? How long have they been there?
    this.destination = null;
    // Parent x/y is in grid coords instead of SVG coords, so need to convert
    this.x = gridCellSize / 2 + this.parent.x * gridCellSize + xVariance;
    this.y = gridCellSize / 2 + this.parent.y * gridCellSize + yVariance;

    people.push(this);
  }

  addToSvg() {
    const { x } = this;
    const { y } = this;

    const person = createSvgElement('path');
    person.setAttribute('d', 'M0 0 0 0');
    person.setAttribute('transform', `translate(${x},${y})`);
    person.setAttribute('stroke', this.type);
    personLayer.append(person);
    this.svgElement = person;

    const shadow = createSvgElement('path');
    shadow.setAttribute('stroke-width', 1.2);
    shadow.setAttribute('d', 'M0 0 .3 .3');
    shadow.setAttribute('transform', `translate(${x},${y})`);
    yurtAndPersonShadowLayer.append(shadow);
    this.shadowElement = shadow;
  }

  render() {
    if (!this.svgElement) return;

    const { x } = this;
    const { y } = this;

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

    if (this.atFarm) {
      // Go back home... soon!
      this.atFarm++;

      if (this.atFarm === 2 && this.farmToVisit.type === colors.fish) {
        // TODO: Give the "bob up to surface" function to the farm or the fish
        // eslint-disable-next-line max-len, no-param-reassign
        shuffle(this.farmToVisit.children).forEach((fish, i) => setTimeout(() => fish.svgBody.style.fill = colors.fish, i * 250));
      }

      // After this many updates, go home
      // TODO: Make sensible number, show some sort of animation
      // originatlRoute.length counts every cell including yurt & farm
      if (
        (this.atFarm > 80 && this.originalRoute.length > 3)
        || (this.atFarm > 120 && this.originalRoute.length > 2)
        || this.atFarm > 160
      ) {
        if (this.farmToVisit.type === colors.fish) {
          // TODO: Give the "bob up to surface" function to the farm or the fish
          // eslint-disable-next-line max-len, no-param-reassign
          shuffle(this.farmToVisit.children).forEach((fish, i) => setTimeout(() => fish.svgBody.style.fill = colors.shade2, 1000 + i * 1000));
        }

        // Go back home. If no route is found, errrr dunno?
        const route = findRoute({
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
          this.originalRoute = [...route];
        } else {
          // Can't find way home :(
          // Reset atFarm so that the way home isn't rechecked every single update(!)
          // adds in some randomness so that if multiple people are stuck,
          // they don't all try to leave at the exact same time
          this.atFarm = Math.random() * 40 + 40;
        }
      }
    }

    // If the person has a destination, gotta follow the route to it!
    // TODO: We have 3 variables for kinda the same thing but maybe we need them
    if (this.hasDestination) {
      if (this.destination) {
        if (this.route?.length) {
          // Head to the first point in the route, and then... remove it when we get there?
          const xVariance = Math.random() * 2 - 1;
          const yVariance = Math.random() * 2 - 1;
          const firstRoutePoint = new Vector(
            gridCellSize / 2 + this.route[0].x * gridCellSize + xVariance,
            gridCellSize / 2 + this.route[0].y * gridCellSize + yVariance,
          );

          const closeEnough = 2;
          const closeEnoughDestination = 1;

          // If a the yurt and farm are adjacent, you don't need to rush...
          if (this.originalRoute.length < 3) {
            this.dx *= 0.9;
            this.dy *= 0.9;
          }

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
                this.farmToVisit.demand -= this.farmToVisit.needyness;
                this.farmToVisit.assignedPeople
                  .splice(this.farmToVisit.assignedPeople.indexOf(this), 1);
                // this.farmToVisit.hideWarn();
                // this.animalToVisit.hasPerson = false;
              }
              this.hasDestination = false;
              return;
            }
          } else if (
            Math.abs(this.x - firstRoutePoint.x) < closeEnough
              && Math.abs(this.y - firstRoutePoint.y) < closeEnough
          ) {
            this.route.shift();
            return;
          }

          // Apply a max speed
          // Usually < 10 loops with 0.1 and 0.98
          while (this.velocity.length() > 0.1) {
            this.dx *= 0.98;
            this.dy *= 0.98;
          }

          const allowedWonkyness = 0.006;
          const speed = 0.01;
          const vectorToNextpoint = this.position.subtract(firstRoutePoint);
          const normalizedVectorToNextPoints = vectorToNextpoint.normalize();

          if (this.x < firstRoutePoint.x + allowedWonkyness) {
            this.dx -= normalizedVectorToNextPoints.x * speed;
          }
          if (this.x > firstRoutePoint.x - allowedWonkyness) {
            this.dx -= normalizedVectorToNextPoints.x * speed;
          }

          if (this.y < firstRoutePoint.y + allowedWonkyness) {
            this.dy -= normalizedVectorToNextPoints.y * speed;
          }
          if (this.y > firstRoutePoint.y - allowedWonkyness) {
            this.dy -= normalizedVectorToNextPoints.y * speed;
          }
          // console.log(firstRoutePoint);
        }
      }
    }

    const slowyDistance = 6;
    const avoidanceDistance = 1.5;
    const turnyness = 0.1;
    // Is currently travelling?
    // could check velocity instead?
    if (this.route?.length > 0) {
      const potentialCollisionPeople = people
        .filter((otherPerson) => otherPerson !== this && !otherPerson.atHome);

      potentialCollisionPeople.forEach((otherPerson) => {
        const distanceBetween = otherPerson.position.distance(this.position);
        const nextDistanceBetween = otherPerson.position.distance(this.position.add(this.velocity));

        if (nextDistanceBetween < distanceBetween) {
          if (nextDistanceBetween < avoidanceDistance) {
            // TODO: Turn left or right depending on what makes most sense
            const vectorBetweenPeople = this.position.subtract(otherPerson.position);
            const normalBetweenPeople = vectorBetweenPeople.normalize();
            const turnLeftVector = rotateVector(normalBetweenPeople, (Math.PI / 2));
            const turnLeftVectorScaled = turnLeftVector.scale(turnyness);
            this.velocity.set(combineVectors(this.velocity, turnLeftVectorScaled));
          }
        }

        const newNextDistanceBetween = otherPerson.position.distance(
          this.position.add(this.velocity),
        );

        if (nextDistanceBetween < slowyDistance && this.velocity.length() > 0.06) {
          if (newNextDistanceBetween < distanceBetween) {
            if (nextDistanceBetween < avoidanceDistance) {
              this.dx *= 0.86;
              this.dy *= 0.86;
            } else {
              this.dx *= 0.89;
              this.dy *= 0.89;
            }
          } else {
            // Getting further away (still want to go slower than usual)
            this.dx *= 0.9;
            this.dy *= 0.9;
          }
        }
      });
    }
  }
}
