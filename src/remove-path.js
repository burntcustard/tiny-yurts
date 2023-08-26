import { drawPaths, paths } from './path';
import { inventory } from './inventory';

export const removePath = (x, y) => {
  paths.filter((path) => (
    (path.points[0].x === x && path.points[0].y === y)
      || (path.points[1].x === x && path.points[1].y === y)
  ) && (
  // Don't remove "fixed" paths i.e. under yurts
    !path.points[0].fixed && !path.points[1].fixed
  )).forEach((pathToRemove) => {
    inventory.paths++;
    pathToRemove.remove();
  });

  drawPaths({ changedCells: [{ x, y }] });
};
