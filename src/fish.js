import { angleToTarget, radToDeg, Vector } from 'kontra';
import { Animal } from './animal';
// Should fish have shadows?
import { animalLayer } from './layers';
import { colors } from './colors';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import { fishCounter, fishCounterWrapper } from './ui';

// Yes the plual of fish is fish, not fishes, if it's only one kind of fish
export const fishes = [];

export class Fish extends Animal {
  constructor(properties) {
    super({
      ...properties,
      parent: properties.parent,
      width: 0.7,
      height: 1,
      roundness: 1,
      color: colors.fish,
    });

    fishes.push(this);
  }

  addToSvg() {
    this.scale = 0;

    this.svgElement = createSvgElement('g');
    this.svgElement.style.transformOrigin = 'center';
    this.svgElement.style.transformBox = 'fill-box';
    this.svgElement.style.transition = `all 1s`;
    this.svgElement.style.willChange = 'transform';
    animalLayer.append(this.svgElement);

    this.svgBody = createSvgElement('rect');
    this.svgBody.setAttribute('fill', colors.fish);
    this.svgBody.setAttribute('width', this.width);
    this.svgBody.setAttribute('height', this.height);
    this.svgBody.setAttribute('rx', this.roundness);
    this.svgBody.style.transition = `fill .2s`;
    this.svgElement.append(this.svgBody);

    this.render();

    fishCounterWrapper.style.width = '96px';
    fishCounterWrapper.style.opacity = 1;

    setTimeout(() => {
      this.scale = 1;
      fishCounter.innerText = fishes.length;
    }, 500);

    setTimeout(() => {
      this.svgElement.style.transition = '';
      this.svgElement.style.willChange = '';
    }, 1500);

    setTimeout(() => {
      this.svgBody.setAttribute('fill', colors.shade2);
    }, 4000);
  }

  update(gameStarted) {
    this.advance();

    if (gameStarted) {
      if (this.isBaby) {
        this.isBaby--;
      }
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

    if (this.hasWarn) {
      this.svgBody.style.fill = colors.fish;
    }
    // this.svgShadowElement.style.transform = `
    //   translate(${x}px, ${y}px)
    //   rotate(${radToDeg(this.rotation) - 90}deg)
    //   scale(${(this.scale + 0.04) * (this.isBaby ? 0.6 : 1)})
    // `;
  }
}
