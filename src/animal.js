import { GameObjectClass } from 'kontra';
import { gridCellSize } from './grid';
import { createSvgElement } from './svg';
import { pinLayer, pointerLayer } from './layers';
import { colors } from './colors';

const padding = 3;

const getRandom = (range) =>
  padding + (Math.random() * (range * gridCellSize - padding * 2));

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

    this.pinSvg = createSvgElement('g');
    this.pinSvg.style.opacity = 0;
    this.pinSvg.style.willChange = 'opacity, transform';
    this.pinSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1)';
    this.pinSvg.style.transformOrigin = 'bottom';
    this.pinSvg.style.transformBox = 'fill-box';
    this.pinSvg.style.transform = `translate(${x}px, ${y}px)`;
    pinLayer.appendChild(this.pinSvg);

    // this.testSvg = createSvgElement('circle');
    // this.testSvg.setAttribute('r', 1);
    // this.testSvg.style.transform = `translate(${x}px, ${y}px)`;
    // this.testSvg.setAttribute('fill', 'red');
    // this.testSvg.setAttribute('opacity', 0.5);
    // pinLayer.appendChild(this.testSvg);

    const pinBubble = createSvgElement('path');
    pinBubble.setAttribute('fill', '#fff');
    pinBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    pinBubble.setAttribute('transform', 'scale(.5) translate(-4 -8)');
    this.pinSvg.appendChild(pinBubble);

    // !
    this.warnSvg = createSvgElement('path');
    this.warnSvg.setAttribute('stroke', this.color);
    this.warnSvg.setAttribute('d', 'M3 6L3 6M3 4.5L3 3');
    this.warnSvg.setAttribute('transform', 'scale(.5) translate(-1 -10.5)');
    this.warnSvg.style.opacity = 0;
    this.pinSvg.appendChild(this.warnSvg);

    // ♥
    this.loveSvg = createSvgElement('path');
    this.loveSvg.setAttribute('fill', this.color);
    this.loveSvg.setAttribute('d', 'M6 6L4 4A1 1 0 1 1 6 2 1 1 0 1 1 8 4Z');
    this.loveSvg.setAttribute('transform', 'scale(.4) translate(-3.5 -10.7)');
    this.loveSvg.style.opacity = 0;
    this.pinSvg.appendChild(this.loveSvg);
  }

  render() {
    const x = this.parent.x * gridCellSize + this.x;
    const y = this.parent.y * gridCellSize + this.y;

    this.pinSvg.style.transform = `
      translate(${x}px, ${y}px)
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
    // pointerLayer.appendChild(debug);

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
    if (this.hasWarn) return;
    this.hasWarn = true;
    this.warnSvg.style.opacity = 1;
    this.loveSvg.style.opacity = 0;
    this.pinSvg.style.opacity = 1;
  }

  removeWarn() {
    if (!this.hasWarn) return;
    this.hasWarn = false;
    this.warnSvg.style.opacity = 0;
    this.pinSvg.style.opacity = 0;
  }
}
