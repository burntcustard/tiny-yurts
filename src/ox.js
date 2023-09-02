import { angleToTarget, radToDeg, Vector } from 'kontra';
import { Animal } from './animal';
import { animalLayer, animalShadowLayer } from './layers';
import { colors } from './colors';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import { oxCounter, oxCounterWrapper } from './ui';

export const oxen = [];

export class Ox extends Animal {
  constructor(properties) {
    super({
      ...properties,
      parent: properties.parent,
      width: 1.5,
      height: 2.5,
      roundness: 0.6,
      color: colors.ox,
      isBaby: properties.isBaby ? 5000 : false,
    });

    oxen.push(this);
  }

  addToSvg() {
    this.scale = 0;

    const ox = createSvgElement('g');
    ox.style.transformOrigin = 'center';
    ox.style.transformBox = 'fill-box';
    ox.style.transition = 'all 1s';
    ox.style.willChange = 'transform';
    this.svgElement = ox;
    animalLayer.appendChild(ox);

    const body = createSvgElement('rect');
    body.setAttribute('fill', colors.ox);
    body.setAttribute('width', this.width);
    body.setAttribute('height', this.height);
    body.setAttribute('rx', this.roundness);
    ox.appendChild(body);

    const horns = createSvgElement('path');
    horns.setAttribute('fill', 'none');
    horns.setAttribute('stroke', colors.oxHorn);
    horns.setAttribute('width', this.width);
    horns.setAttribute('height', this.height);
    horns.setAttribute('d', 'M0 2Q0 1 1 1 Q2 1 2 2');
    horns.setAttribute('transform', 'translate(-0.2 .6)');
    horns.setAttribute('stroke-width', 0.4);
    if (this.isBaby) {
      horns.style.transition = 'all 1s';
      horns.style.willChange = 'opacity';
      horns.style.opacity = 0;
    }
    this.svgHorns = horns;
    ox.appendChild(horns);

    const shadow = createSvgElement('rect');
    shadow.setAttribute('width', this.width);
    shadow.setAttribute('height', this.height);
    shadow.setAttribute('rx', this.roundness);
    shadow.style.transformOrigin = 'center';
    shadow.style.transformBox = 'fill-box';
    shadow.style.transition = 'all 1s';
    shadow.style.willChange = 'transform';
    this.svgShadowElement = shadow;
    animalShadowLayer.appendChild(shadow);

    this.render();

    oxCounterWrapper.style.width = '96px';
    oxCounterWrapper.style.opacity = '1';

    setTimeout(() => {
      this.scale = 1;

      // Only add to the counter after 1/2 a second, otherwise it ruins the surprise!
      oxCounter.innerText = oxen.length;
    }, 500);

    setTimeout(() => {
      ox.style.transition = '';
      ox.style.willChange = '';
      shadow.style.willChange = '';
      shadow.style.transition = '';
    }, 1500);
  }

  update(gameStarted) {
    this.advance();

    if (gameStarted) {
      if (this.isBaby === 1) {
        this.svgHorns.style.opacity = 1;
      }

      if (this.isBaby) {
        this.isBaby--;
      }
    }

    // Maybe pick a new target location
    if (Math.random() > 0.99) {
      this.target = this.getRandomTarget();
    }

    if (this.target) {
      const angle = angleToTarget(this, this.target);
      const angleDiff = angle - this.rotation;
      const targetVector = Vector(this.target);
      const dist = targetVector.distance(this) > 1;

      if (Math.abs(angleDiff % (Math.PI * 2)) > 0.1) {
        this.rotation += angleDiff > 0 ? 0.04 : -0.04;
        // console.log(radToDeg(this.rotation), radToDeg(angle));
      } else if (dist > 0.1) {
        const normalized = targetVector.subtract(this).normalize();
        const newPosX = this.x + normalized.x * 0.05;
        const newPosY = this.y + normalized.y * 0.05;
        // Check if new pos is not too close to other ox
        const tooCloseToOtherOxes = this.parent.children.some((o) => {
          if (this === o) return false;
          const otherOxVector = Vector(o);
          const oldDistToOtherOx = otherOxVector.distance({ x: this.x, y: this.y });
          const newDistToOtherOx = otherOxVector.distance({ x: newPosX, y: newPosY });
          return newDistToOtherOx < 4 && newDistToOtherOx < oldDistToOtherOx;
        });
        if (!tooCloseToOtherOxes) {
          this.x = newPosX;
          this.y = newPosY;
        }
      }
    }
  }

  render() {
    super.render();

    const x = this.parent.x * gridCellSize + this.x - this.width / 2;
    const y = this.parent.y * gridCellSize + this.y - this.height / 2;

    this.svgElement.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${radToDeg(this.rotation) - 90}deg)
      scale(${this.scale * (this.isBaby ? 0.5 : 1)})
    `;
    this.svgShadowElement.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${radToDeg(this.rotation) - 90}deg)
      scale(${(this.scale + 0.04) * (this.isBaby ? 0.5 : 1)})
    `;
  }
}
