import { drawPaths, paths } from './path';
import { inventory } from './inventory';
import { pathTilesIndicatorCount } from './ui';

export const removePath = (x, y) => {
  paths.filter((path) => (
    (path.points[0].x === x && path.points[0].y === y)
      || (path.points[1].x === x && path.points[1].y === y)
  ) && (
  // Don't remove "fixed" paths i.e. under yurts
    !path.points[0].fixed && !path.points[1].fixed
  )).forEach((pathToRemove) => {
    if (inventory.paths < 99) {
      inventory.paths++;
      pathTilesIndicatorCount.innerText = inventory.paths;
    }
    pathToRemove.remove();
  });

  drawPaths({ changedCells: [{ x, y }] });
};
