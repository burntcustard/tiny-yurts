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
      x: getRandom(properties.parent?.width ?? 0),
      y: getRandom(properties.parent?.height ?? 0),
      rotation: properties.rotation ?? (Math.random() * Math.PI * 4) - Math.PI * 2,
    });

    const x = this.parent.x * gridCellSize + this.x;
    const y = this.parent.y * gridCellSize + this.y;

    this.isBaby = properties.isBaby ?? false;
    this.roundness = properties.roundness;
    this.hasIssue = false;

    this.issueSvg = createSvgElement('g');
    this.issueSvg.style.opacity = 0;
    this.issueSvg.style.willChange = 'opacity, transform';
    this.issueSvg.style.transition = 'all.8s cubic-bezier(.5,2,.5,1)';
    this.issueSvg.style.transformOrigin = 'bottom';
    this.issueSvg.style.transformBox = 'fill-box';
    this.issueSvg.style.transform = `
      translate(${x}px, ${y}px)
      scale(${this.hasIssue ? 1 : 0})
    `;
    pinLayer.appendChild(this.issueSvg);

    const issueBubble = createSvgElement('path');
    issueBubble.setAttribute('fill', '#fff');
    issueBubble.setAttribute('d', 'm6 6-2-2a3 3 0 1 1 4 0Z');
    issueBubble.setAttribute('transform', 'scale(.5) translate(-4 -8)');
    this.issueSvg.appendChild(issueBubble);

    const dot = createSvgElement('path');
    dot.setAttribute('stroke', colors.ox);
    dot.setAttribute('d', 'M3 6L3 6M3 4.5L3 3');
    dot.setAttribute('transform', 'scale(.5) translate(-1 -10.5)');
    this.issueSvg.appendChild(dot);
  }

  render() {
    const x = this.parent.x * gridCellSize + this.x - this.width / 2;
    const y = this.parent.y * gridCellSize + this.y - this.height / 2;

    if (this.hasIssue) {
      this.issueSvg.style.transform = `
        translate(${x}px, ${y}px)
        scale(${this.hasIssue ? 1 : 0})
      `;
    }
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

  giveIssue() {
    if (this.hasIssue) return;
    this.hasIssue = true;
    this.render(); // Extra render to get the issueSvg in the correct x/y
    this.issueSvg.style.opacity = 1;
  }

  removeIssue() {
    if (!this.hasIssue) return;
    this.hasIssue = false;
    this.issueSvg.style.opacity = 0;
  }
}
