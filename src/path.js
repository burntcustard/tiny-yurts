import { Structure } from './structure';
import { pathLayer } from './layers';
import { createSvgElement } from './svg';
// import { createSvgElement } from './svg';
// import { pathLayer } from './layers';
import { gridCellSize } from './grid';

/**
 * Yurts each need to have...
 * - types - Ox is brown, goat is grey, etc.
 * - number of people currently inside?
 * - people belonging to the yurt?
 * - x and y coordinate in the grid
 */

const toSvgCoord = (c) => gridCellSize / 2 + c * gridCellSize;

export let paths = [];

export const pathSvgWidth = 3;

export let connections = [];

export let pathsData = [];

export const drawPaths = () => {
  // Convert list of paths into list of connections

  // go through each cell and look for paths with either end on both points?
  connections = [];

  // Compare each path to every other path
  paths.forEach(path1 => {
    paths.forEach(path2 => {
      if (path1 === path2) return;

      // If there is already this pair of paths in the connections list, skip
      if (connections.find(c => c.path1 === path2 && c.path2 === path1)) {
        return;
      }

      // If the path is just a dot (both points in same cell), skip
      if (
        (path1.points[0].x === path1.points[1].x && path1.points[0].y === path1.points[1].y) ||
        (path2.points[0].x === path2.points[1].x && path2.points[0].y === path2.points[1].y)
      ) {
        return;
      }

      if (
        path1.points[0].x === path2.points[0].x &&
        path1.points[0].y === path2.points[0].y
      ) {
        connections.push({
          path1,
          path2,
          points: [
            path1.points[1],
            path1.points[0],
            path2.points[1],
          ],
        });
      } else if  (
        path1.points[0].x === path2.points[1].x &&
        path1.points[0].y === path2.points[1].y
      ) {
        connections.push({
          path1,
          path2,
          points: [
            path1.points[1],
            path1.points[0],
            path2.points[0],
          ],
        });
      } else if (
        path1.points[1].x === path2.points[0].x &&
        path1.points[1].y === path2.points[0].y
      ) {
        connections.push({
          path1,
          path2,
          points: [
            path1.points[0],
            path1.points[1],
            path2.points[1],
          ],
        });
      } else if (
        path1.points[1].x === path2.points[1].x &&
        path1.points[1].y === path2.points[1].y
      ) {
        connections.push({
          path1,
          path2,
          points: [
            path1.points[0],
            path1.points[1],
            path2.points[0],
          ],
        });
      }
    });
  });

  let newPathsData = [];

  connections.forEach(connection => {
    const { path1, path2, points } = connection;

    // Starting point
    const M = `M${toSvgCoord(points[0].x)} ${toSvgCoord(points[0].y)}`;

    // A line that goes from 1st cell to the border between it and middle cell
    const Lx1 = toSvgCoord(points[0].x + (points[1].x - points[0].x) / 2);
    const Ly1 = toSvgCoord(points[0].y + (points[1].y - points[0].y) / 2);
    const L1 = `L${Lx1} ${Ly1}`;

    // A line that goes from the end of the curve (Q) to the 2nd point
    const Lx2 = toSvgCoord(points[2].x);
    const Ly2 = toSvgCoord(points[2].y);
    const L2 = `L${Lx2} ${Ly2}`;

    const Qx1 = toSvgCoord(points[1].x);
    const Qx2 = toSvgCoord(points[1].y);
    const Qx = toSvgCoord(points[1].x + (points[2].x - points[1].x) / 2);
    const Qy = toSvgCoord(points[1].y + (points[2].y - points[1].y) / 2);
    const Q = `Q${Qx1} ${Qx2} ${Qx} ${Qy}`;

    // Only draw the starty bit if it's not the center of another connection
    const start = connections
      .find(c => points[0].x === c.points[1].x && points[0].y === c.points[1].y) ?
      `M${Lx1} ${Ly1}` :
      `${M}${L1}`;
    const end = connections
      .find(c => points[2].x === c.points[1].x && points[2].y === c.points[1].y) ?
      '' :
      L2;

    newPathsData.push({
      path1,
      path2,
      d: `${start}${Q}${end}`
    });

    // pathElement.setAttribute('d', `${start}${Q}${end}`);
    // pathLayer.appendChild(pathElement);
  });

  // What about paths that have 0 connections ???
  paths.forEach(path => {
    if (!connections.find(c => c.path1 !== path && c.path2 !== path)) {
      const { points } = path;
      // this path has no connections, we need to add it to the list as a little 2x1 path
      const M = `M${toSvgCoord(points[0].x)} ${toSvgCoord(points[0].y)}`;
      const L = `L${toSvgCoord(points[1].x)} ${toSvgCoord(points[1].y)}`;
      newPathsData.push({
        path,
        d: `${M}${L}`,
      });
    }
  });

  console.log('path elements:');
  newPathsData.forEach(newPathData => {
    let doesntExistYet = true;

    pathsData.forEach(oldPathData => {
      // it's the same path, skip
      // if (newPathData === oldPathData) return;

      // it's the same connection (set of two specific paths) as before
      if (
        (newPathData.path && newPathData.path === oldPathData.path) ||
        (newPathData.path1 && newPathData.path1 === oldPathData.path1 && newPathData.path2 === oldPathData.path2)
      ) {
        doesntExistYet = false;
        newPathData.svgElement = oldPathData.svgElement;

        // The two path datas are different, this connection/path aaah needs updating
        if (newPathData.d !== oldPathData.d) {
          newPathData.svgElement.setAttribute('d', newPathData.d);
        }
      }
    });

    if (doesntExistYet) {
      newPathData.svgElement = createSvgElement('path');
      newPathData.svgElement.setAttribute('d', newPathData.d);
      newPathData.svgElement.style.transition = 'all.3s';
      pathLayer.appendChild(newPathData.svgElement);
    }

    // console.log(newPathData.svgElement);
  });

  // pathsData.forEach(oldPathData => {
  //   let foundInNewData = false;

  //   newPathsData.forEach(newPathData => {
  //     if (oldPathData.path === newPathData.path) {
  //       foundInNewData = true;
  //     }
  //   });

  //   if (!foundInNewData) {

  //   }
  // });

  pathsData = [...newPathsData];
}

export class Path extends Structure {
  constructor(properties) {
    const { points } = properties;

    super({
      ...properties,
      points,
    });

    paths.push(this);

    // drawPaths();
    // Redraw all paths that are connected immediately to this?
  }

  remove() {
    // Remove from DOM
    pathsData.find(p => p.path === this).svgElement.remove();

    // Remove from paths array
    paths.splice(paths.findIndex((p) => p === this), 1);
  }

  // drawSvg() {
  //   this.svgElement.setAttribute('d', `M${x} ${y} ${this.points.reduce((p, i) => `L${i < index ? toSvgCoord(p.x) : x} ${toSvgCoord(p.y)}`, '')}`);
  // }

  // drawSvg() {
  //   // Start and end match, actually just draw a circle
  //   // if (this.start.x === this.end.x && this.start.y === this.start.y) {
  //   //   this.svgElement = createSvgElement('circle');
  //   //   this.svgElement.setAttribute('fill', colors.path);
  //   // }
  //   const x = toSvgCoord(this.x);
  //   const y = toSvgCoord(this.y);
  //   this.svgElement.setAttribute('d', `M${x} ${y} L${x} ${y} ${this.points.reduce((p, i) => i > 0 ? `L${toSvgCoord(p.x)} ${toSvgCoord(p.y)}` : '', '')}`);

  //   for (let index = 0; index < this.points.length; index++) {
  //     setTimeout(() => {
  //       this.svgElement.setAttribute('d', `M${x} ${y} ${this.points.reduce((p, i) => `L${i < index ? toSvgCoord(p.x) : x} ${toSvgCoord(p.y)}`, '')}`);
  //     }, 500 * index);
  //   }
  // }

  // addToSvg() {
  //   const x = gridCellSize / 2 + this.x * gridCellSize;
  //   const y = gridCellSize / 2 + this.y * gridCellSize;
  //   this.svgElement.setAttribute('fill', 'none');
  //   this.svgElement.setAttribute('d', this.d);
  //   this.svgElement.setAttribute('stroke-width', 0);
  //   this.svgElement.style.transition = 'all.3s';
  //   pathLayer.appendChild(this.svgElement);

  //   // After a while, animate to real radius and shadow coords
  //   setTimeout(() => {
  //     this.svgElement.setAttribute('stroke-width', pathSvgWidth);
  //   });

  //   this.drawSvg();
  // }

  // addPoint({ x, y }) {
  //   this.points.push({ x, y });
  //   this.drawSvg();
  // }
}
