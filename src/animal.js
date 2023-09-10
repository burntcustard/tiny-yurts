import { GameObjectClass } from 'kontra';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import { pinLayer } from './layers';
import { playWarnNote } from './audio';

export const animals = [];
const padding = 3;

const getRandom = (range) => padding + (Math.random() * (range * gridCellSize - padding * 2));

export class Animal extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
      anchor: { x: 0.5, y: 0.5 },
      x: getRandom(properties.parent?.width ?? 0),
      y: getRandom(properties.parent?.height ?? 0),
      rotation: properties.rotation ?? (Math.random() * Math.PI * 4) - Math.PI * 2,
    });

    const x = this.parent.x * gridCellSize + this.x;
    const y = this.parent.y * gridCellSize + this.y;

    this.isBaby = properties.isBaby ?? false;
    this.roundness = properties.roundness;
    this.hasWarn = false;
    this.hasPerson = null; // Ref to person on their way to say hi

    this.pinSvg = createSvgElement('g');
    this.pinSvg.style.opacity = 0;
    this.pinSvg.style.willChange = 'opacity, transform';
    this.pinSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1)';
    this.pinSvg.style.transformOrigin = 'bottom';
    this.pinSvg.style.transformBox = 'fill-box';
    this.pinSvg.style.transform = `translate(${x}px, ${y - this.height / 2}px)`;
    pinLayer.append(this.pinSvg);

    const pinBubble = createSvgElement('path');
    pinBubble.setAttribute('fill', '#fff');
    pinBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    pinBubble.setAttribute('transform', 'scale(.5) translate(-6 -8)');
    this.pinSvg.append(pinBubble);

    // !
    this.warnSvg = createSvgElement('path');
    this.warnSvg.setAttribute('stroke', this.color);
    this.warnSvg.setAttribute('d', 'M3 6L3 6M3 4.5L3 3');
    this.warnSvg.setAttribute('transform', 'scale(.5) translate(-3 -10.4)');
    this.warnSvg.style.opacity = 0;
    this.pinSvg.append(this.warnSvg);

    // ♥
    this.loveSvg = createSvgElement('path');
    this.loveSvg.setAttribute('fill', this.color);
    this.loveSvg.setAttribute('d', 'M6 6L4 4A1 1 0 1 1 6 2 1 1 0 1 1 8 4Z');
    this.loveSvg.setAttribute('transform', 'scale(.3) translate(-6 -13)');
    this.loveSvg.style.opacity = 0;
    this.pinSvg.append(this.loveSvg);

    animals.push(this);
  }

  render() {
    const x = this.parent.x * gridCellSize + this.x;
    const y = this.parent.y * gridCellSize + this.y;

    this.pinSvg.style.transform = `
      translate(${x}px, ${y - this.height / 2}px)
      scale(${this.hasWarn || this.hasLove ? 1 : 0})
    `;

    // this.testSvg.style.transform = `
    //   translate(${x}px, ${y}px)
    //   scale(${0.5})
    // `;
  }

  getRandomTarget() {
    const randomTarget = {
      x: getRandom(this.parent.width),
      y: getRandom(this.parent.height),
    };

    // const debug = createSvgElement('circle');
    // const x = this.parent.x * gridCellSize + randomTarget.x;
    // const y = this.parent.y * gridCellSize + randomTarget.y;
    // debug.setAttribute('transform', `translate(${x},${y})`);
    // debug.setAttribute('r', .5);
    // debug.setAttribute('fill', 'red');
    // pointerLayer.append(debug);

    return randomTarget;
  }

  showLove() {
    this.hasLove = true;
    this.pinSvg.style.opacity = 1;
    this.warnSvg.style.opacity = 0;
    this.loveSvg.style.opacity = 1;
  }

  hideLove() {
    this.hasLove = false;
    this.pinSvg.style.opacity = this.hasWarn ? 1 : 0;
    this.warnSvg.style.opacity = this.hasWarn ? 1 : 0;
    this.loveSvg.style.opacity = 0;
  }

  showWarn() {
    playWarnNote(this.color);
    this.hasWarn = true;
    this.warnSvg.style.opacity = 1;
    this.loveSvg.style.opacity = 0;
    this.pinSvg.style.opacity = 1;
  }

  hideWarn() {
    this.hasWarn = false;
    this.loveSvg.style.opacity = this.hasLove ? 1 : 0;
    this.pinSvg.style.opacity = this.hasLove ? 1 : 0;
    this.warnSvg.style.opacity = 0;
  }

  toggleWarn(toggle) {
    if (toggle) {
      this.showWarn();
    } else {
      this.hideWarn();
    }
  }
}
