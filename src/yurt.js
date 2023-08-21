import { createSvgElement } from './svg';
import { Structure } from './structure';
import {
  yurtDecorationLayers, yurtLayer, yurtShadowLayer, pathLayer,
} from './layers';
import { gridCellSize } from './grid';
import { Path, drawPaths, pathsData } from './path';
import { colors } from './colors';
import { Person } from './person';

export const yurts = [];

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

export class Yurt extends Structure {
  constructor(properties) {
    const { x, y } = properties;

    super({
      ...properties,
      // connections: [
      //   { from: { x, y }, to: { x: x    , y: y - 1}, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y - 1}, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y    }, object: null },
      //   { from: { x, y }, to: { x: x + 1, y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x    , y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y + 1}, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y    }, object: null },
      //   { from: { x, y }, to: { x: x - 1, y: y - 1}, object: null },
      // ],
    });

    this.type = properties.type;
    yurts.push(this);

    // Which way is the yurt facing (randomly up/down/left/right to start)
    // TODO: Less disguisting way to determine initial direction
    const facingInt = Math.floor(Math.random() * 4);
    if (facingInt < 0.25) {
      this.facing = { x: 0, y: -1 }
    } else if (facingInt < 0.5) {
      this.facing = { x: 1, y: 0 }
    } else if (facingInt < 0.75) {
      this.facing = { x: 0, y: 1 }
    } else {
      this.facing = { x: -1, y: 0 }
    }

    setTimeout(() => {
      this.startPath = new Path({
        points: [
          { x, y, fixed: true },
          { x: x + this.facing.x, y: y + this.facing.y },
        ],
      });

      drawPaths({ changedCells: [
        { x, y, fixed: true },
        { x: x + this.facing.x, y: y + this.facing.y }
      ]});
    }, 1000)

    setTimeout(() => {
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.push(new Person({ x: this.x, y: this.y, parent: this }));
      this.children.forEach(p => p.addToSvg());
    }, 2000);
  }

  rotateTo(x, y) {
    this.facing = {
      x: x - this.x,
      y: y - this.y,
    };

    const oldPathsInPathData = pathsData.filter(p =>
      p.path === this.startPath ||
      p.path1 === this.startPath ||
      p.path2 === this.startPath
    );

    oldPathsInPathData.forEach(p => {
      p.svgElement.setAttribute('stroke-width', 0);
      p.svgElement.setAttribute('opacity', 0);

      setTimeout(() => {
        p.svgElement.remove();
      }, 500);
    });

    // this.startPath.points[1] = { x: this.x, y: this.y };
    // console.log(this.startPath.points[1]);
    this.oldStartPath = this.startPath;
    this.oldStartPath.noConnect = true;

    // Add the new path

    this.startPath = new Path({
      points: [
        { x: this.x, y: this.y, fixed: true },
        { x, y },
      ],
    });

    // Redraw
    drawPaths({ changedCells: [{ x: this.x, y: this.y, fixed: true }, { x, y }], fadeout: true });

    const pathInPathData = pathsData.find(p => p.path === this.startPath);

    if (pathInPathData) {
      pathInPathData.svgElement.setAttribute('stroke-width', 0);

      setTimeout(() => {
        pathInPathData.svgElement.removeAttribute('stroke-width');
      }, 100);
    }

    setTimeout(() => {
      this.oldStartPath.remove();
    }, 400);
  }

  addToSvg() {
    const x = gridCellSize / 2 + this.x * gridCellSize;
    const y = gridCellSize / 2 + this.y * gridCellSize;

    const yurt = createSvgElement('circle');
    yurt.setAttribute('transform', `translate(${x},${y})`);
    yurt.style.transition = 'all.4s';
    yurtLayer.appendChild(yurt);

    const baseShadow = createSvgElement('circle');
    baseShadow.setAttribute('fill', colors.shadowS);
    baseShadow.setAttribute('r', 0)
    baseShadow.setAttribute('stroke', 'none');
    baseShadow.setAttribute('transform', `translate(${x},${y})`);
    baseShadow.style.transition = 'all.2s';
    yurtShadowLayer.appendChild(baseShadow);
    setTimeout(() => baseShadow.setAttribute('r', 3));

    const shadow = createSvgElement('path');
    shadow.setAttribute('stroke-width', 0);
    shadow.setAttribute('d', 'M0 0l0 0');
    shadow.setAttribute('transform', `translate(${x},${y})`);
    shadow.style.transition = 'stroke-width.4s,d.4s.3s';
    yurtShadowLayer.appendChild(shadow);

    const decoration = createSvgElement('circle');
    decoration.setAttribute('fill', 'none');
    decoration.setAttribute('r', 1);
    decoration.setAttribute('transform', `translate(${x},${y})`);
    decoration.setAttribute('stroke-dasharray', 6.3); // Math.PI * 2 + a bit
    decoration.setAttribute('stroke-dashoffset', 6.3);
    decoration.style.transition = 'all.5s.5s';
    yurtDecorationLayers[this.type].appendChild(decoration);

    // After a while, animate to real radius and shadow coords
    setTimeout(() => {
      yurt.setAttribute('r', 3);
      shadow.setAttribute('stroke-width', '6');
      shadow.setAttribute('d', 'M0 0l2 2');
      decoration.setAttribute('stroke-dashoffset', 0);
    }, 200);
  }

  addPath() {
    // const path = createSvgElement('path'); // Convenient naming there
    // const x = gridCellSize / 2 + this.x * gridCellSize;
    // const y = gridCellSize / 2 + this.y * gridCellSize;
    // const relativePathX = this.direction.x * 4;
    // const relativePathY = this.direction.y * 4;
    // path.setAttribute('fill', 'none');
    // path.setAttribute('d', `M${x} ${y}l${0} ${0}`);
    // path.style.transition = 'all.5s';
    // pathLayer.appendChild(path);

    // setTimeout(() => {
    //   path.setAttribute('d', `M${x} ${y}l${relativePathX} ${relativePathY}`);
    // }, 500);
  }
}
