import { angleToTarget, radToDeg, Vector } from 'kontra';
import { Animal } from './animal';
import { animalLayer, animalShadowLayer } from './layers';
import { colors } from './colors';
import { createSvgElement, gridCellSize } from './svg';
import { goatCounter, goatCounterWrapper } from './ui';

export const goats = [];

export class Goat extends Animal {
  constructor(properties) {
    super({
      ...properties,
      parent: properties.parent,
      width: 1,
      height: 1.5,
      roundness: 0.6,
      color: colors.goat,
      isBaby: properties.isBaby ? 4000 : false,
    });

    goats.push(this);
  }

  addToSvg() {
    this.scale = 0;

    const goat = createSvgElement('g');
    goat.style.transformOrigin = 'center';
    goat.style.transformBox = 'fill-box';
    goat.style.transition = 'all 1s';
    goat.style.willChange = 'transform';
    this.svgElement = goat;
    animalLayer.appendChild(goat);

    const body = createSvgElement('rect');
    body.setAttribute('fill', colors.goat);
    body.setAttribute('width', this.width);
    body.setAttribute('height', this.height);
    body.setAttribute('rx', this.roundness);
    goat.appendChild(body);

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

    goatCounterWrapper.style.width = '96px';
    goatCounterWrapper.style.opacity = '1';

    setTimeout(() => {
      this.scale = 1;
      goatCounter.innerText = goats.length;
    }, 500);

    setTimeout(() => {
      goat.style.transition = '';
      goat.style.willChange = '';
      shadow.style.willChange = '';
      shadow.style.transition = '';
    }, 1500);
  }

  update() {
    this.advance();

    if (this.isBaby) {
      this.isBaby--;
    }

    // Maybe pick a new target location
    if (Math.random() > 0.96) {
      this.target = this.getRandomTarget();
    }

    if (this.target) {
      const angle = angleToTarget(this, this.target);
      const angleDiff = angle - this.rotation;
      const targetVector = Vector(this.target);
      const dist = targetVector.distance(this) > 1;

      if (Math.abs(angleDiff % (Math.PI * 2)) > 0.1) {
        this.rotation += angleDiff > 0 ? 0.1 : -0.1;
        // console.log(radToDeg(this.rotation), radToDeg(angle));
      } else if (dist > 0.1) {
        const normalized = targetVector.subtract(this).normalize();
        const newPosX = this.x + normalized.x * 0.1;
        const newPosY = this.y + normalized.y * 0.1;
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
      scale(${this.scale * (this.isBaby ? 0.6 : 1)})
    `;
    this.svgShadowElement.style.transform = `
      translate(${x}px, ${y}px)
      rotate(${radToDeg(this.rotation) - 90}deg)
      scale(${(this.scale + 0.04) * (this.isBaby ? 0.6 : 1)})
    `;
  }
}
