// We pass refs to pathData in forEach, for now it's easier to reassign props directly
/* eslint-disable no-param-reassign */
import { GameObjectClass } from './modified-kontra/game-object';
import { pathLayer, pathShadowLayer, rockShadowLayer } from './layers';
import { gridCellSize } from './svg';
import { createSvgElement } from './svg-utils';
import { colors } from './colors';
import { trees } from './tree';

const toSvgCoord = (c) => gridCellSize / 2 + c * gridCellSize;

export const paths = [];
export const pathSvgWidth = 3;
let connections = [];
let pathsData = [];
let recentlyRemoved = [];
export const getPathsData = () => pathsData;

export const drawPaths = ({ fadeout, noShadow }) => {
  // only care about paths in or next to changedCell

  // const changedPaths = changedCells.length ? paths.filter(path => {
  //   return changedCells.some(changedCell => (
  //     (
  //       (path.points[0].x === changedCell.x) &&
  //       (path.points[0].y === changedCell.y)
  //     ) || (
  //       (path.points[1].x === changedCell.x) &&
  //       (path.points[1].y === changedCell.y)
  //     )
  //   ));
  // }) : paths;

  // console.log(changedCells);

  const changedPaths = paths;

  // go through each cell and look for paths with either end on both points?
  connections = [];

  // Compare each path to every other path
  changedPaths.forEach((path1) => {
    changedPaths.forEach((path2) => {
      if (path1 === path2) return;

      // If there is already this pair of paths in the connections list, skip
      if (connections.find((c) => c.path1 === path2 && c.path2 === path1)) {
        return;
      }

      // If either path has the 'do not connect anything to me' flag then skip
      if (path1.noConnect || path2.noConnect) return;

      if (
        path1.points[0].x === path2.points[0].x
        && path1.points[0].y === path2.points[0].y
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
      } else if (
        path1.points[0].x === path2.points[1].x
        && path1.points[0].y === path2.points[1].y
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
        path1.points[1].x === path2.points[0].x
        && path1.points[1].y === path2.points[0].y
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
        path1.points[1].x === path2.points[1].x
        && path1.points[1].y === path2.points[1].y
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

  const newPathsData = [];

  connections.forEach((connection) => {
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
      .find((c) => points[0].x === c.points[1].x && points[0].y === c.points[1].y)
      ? `M${Lx1} ${Ly1}`
      : `${M}${L1}`;
    const end = connections
      .find((c) => points[2].x === c.points[1].x && points[2].y === c.points[1].y)
      ? ''
      : L2;

    newPathsData.push({
      path1,
      path2,
      d: `${start}${Q}${end}`,
    });
  });

  // What about paths that have 0 connections ???
  changedPaths.forEach((path) => {
    const connected = connections.find((c) => c.path1 === path || c.path2 === path);

    if (!connected && !path.noConnect) {
      const { points } = path;
      // this path has no connections, need to add it to the list as a little 2x1 path
      const M = `${toSvgCoord(points[0].x)} ${toSvgCoord(points[0].y)}`;
      const L = `${toSvgCoord(points[1].x)} ${toSvgCoord(points[1].y)}`;
      newPathsData.push({
        path,
        d: `M${M}L${L}`,
        M,
        L,
      });
    }
  });

  newPathsData.forEach((newPathData) => {
    pathsData.forEach((oldPathData) => {
      // it's the same path, skip
      // if (newPathData === oldPathData) return;

      // it's the same connection (set of two specific paths) as before
      const samePath = newPathData.path && newPathData.path === oldPathData.path;
      const samePath1 = newPathData.path1 && newPathData.path1 === oldPathData.path1;
      const samePath2 = newPathData.path2 && newPathData.path2 === oldPathData.path2;
      if ((samePath) || (samePath1 && samePath2)) {
        newPathData.svgElement = oldPathData.svgElement;
        newPathData.svgElementStoneShadow = oldPathData.svgElementStoneShadow;
        newPathData.svgElementShadow = oldPathData.svgElementShadow;

        // The two path datas are different, this connection/path aaah needs updating
        if (newPathData.d !== oldPathData.d) {
          oldPathData.d = newPathData.d;
          newPathData.svgElement.setAttribute('d', newPathData.d);
          newPathData.svgElementStoneShadow?.setAttribute('d', newPathData.d);
        }
      }
    });

    // Remove old path SVGs
    pathsData.forEach((oldPathData) => {
      if (!newPathsData.find((newPathData2) => oldPathData.d === newPathData2.d)) {
        if (oldPathData.path) {
          // if (changedPaths.includes(oldPathData.path)) {
          if (fadeout && oldPathData.path && oldPathData.path.points[0].fixed) {
            setTimeout(() => {
              oldPathData.svgElement.remove();
              oldPathData.svgElementStoneShadow?.remove();
            }, 500);
          } else {
            oldPathData.svgElement.remove();
            oldPathData.svgElementStoneShadow?.remove();
          }
          // }
        }
      }
    });

    // There's a new bit of path data that needs drawing
    if (!newPathData.svgElement) {
      newPathData.svgElement = createSvgElement('path');
      newPathData.svgElement.setAttribute('d', newPathData.d);
      newPathData.svgElement.style.transition = `all .4s, opacity .2s`;

      if (newPathData.path?.points[0].stone
        || newPathData.path?.points[1].stone
        || newPathData.path1?.points[0].stone
        || newPathData.path1?.points[1].stone
        || newPathData.path2?.points[0].stone
        || newPathData.path2?.points[1].stone) {
        newPathData.svgElement.style.strokeDasharray = '0 3px';
        newPathData.svgElement.style.strokeWidth = '2px';
        newPathData.svgElement.style.stroke = '#bbb';

        // Chrome does not support sub-pixel CSS filters, so instead of this, we need another path
        // newPathData.svgElement.style.filter = `drop-shadow(.3px .3px ${colors.shade2})`;

        newPathData.svgElementStoneShadow = createSvgElement('path');
        newPathData.svgElementStoneShadow.setAttribute('d', newPathData.d);
        newPathData.svgElementStoneShadow.style.transition = `all .4s opacity .2s`;
        newPathData.svgElementStoneShadow.style.strokeDasharray = '0 3px';
        newPathData.svgElementStoneShadow.style.strokeWidth = '2px';
        newPathData.svgElementStoneShadow.style.stroke = colors.black;

        rockShadowLayer.append(newPathData.svgElementStoneShadow);
      }

      pathLayer.append(newPathData.svgElement);

      // Only transition "new new" single paths
      const pathInSameCellRecentlyRemoved = newPathData.path && recentlyRemoved.some((r) => (
        (
          r.x === newPathData.path.points[0].x
            && r.y === newPathData.path.points[0].y
        ) || (
          r.x === newPathData.path.points[1].x
            && r.y === newPathData.path.points[1].y
        )
      ));

      const isYurtPath = newPathData.path?.points[0].fixed;

      if (newPathData.path === undefined || !pathInSameCellRecentlyRemoved || isYurtPath) {
        newPathData.svgElement.setAttribute('stroke-width', 0);
        newPathData.svgElement.setAttribute('opacity', 0);
        newPathData.svgElement.style.willChange = `stroke-width, opacity`;

        if (isYurtPath) {
          newPathData.svgElement.setAttribute('d', `M${newPathData.M}L${newPathData.M}`);

          setTimeout(() => {
            newPathData.svgElement.setAttribute('d', `M${newPathData.M}L${newPathData.L}`);
          }, 20);
        }

        if (!noShadow) {
          newPathData.svgElementShadow = createSvgElement('path');
          newPathData.svgElementShadow.setAttribute('d', newPathData.d);
          pathShadowLayer.append(newPathData.svgElementShadow);

          // After transition complete, we don't need the shadow anymore
          setTimeout(() => {
            newPathData.svgElementShadow?.remove();
            newPathData.svgElement.style.willChange = '';
          }, 500);
        }

        setTimeout(() => {
          newPathData.svgElement.removeAttribute('stroke-width');
          newPathData.svgElement.setAttribute('opacity', 1);
        }, 20);
      }
    }
  });

  pathsData = [...newPathsData];
  recentlyRemoved = [];
};

export class Path extends GameObjectClass {
  constructor(properties) {
    const { points } = properties;

    super({
      ...properties,
      points,
    });

    trees
      .filter((t) => this.points.some((p) => p.x === t.x && p.y === t.y))
      .forEach((tree) => tree.remove());

    paths.push(this);
  }

  remove() {
    pathsData = pathsData.filter((p) => {
      if (p.path === this || p.path1 === this || p.path2 === this) {
        p.svgElement.setAttribute('opacity', 0);
        p.svgElement.setAttribute('stroke-width', 0);
        p.svgElementStoneShadow?.setAttribute('opacity', 0);
        p.svgElementStoneShadow?.setAttribute('stroke-width', 0);

        setTimeout(() => {
          p.svgElement.remove();
          p.svgElementStoneShadow?.remove();
        }, 500);
        return false;
      }

      return true;
    });

    // Remove from paths array
    paths.splice(paths.findIndex((p) => p === this), 1);

    recentlyRemoved.push(
      { x: this.points[0].x, y: this.points[0].y },
      { x: this.points[1].x, y: this.points[1].y },
    );
  }
}
