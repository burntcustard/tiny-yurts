import { drawPaths, paths } from './path';
import { inventory } from './inventory';
import { pathTilesIndicatorCount } from './ui';
import { playPathDeleteNote } from './audio';

export const removePath = (x, y) => {
  const pathsToRemove = paths.filter((path) => (
    (path.points[0].x === x && path.points[0].y === y)
      || (path.points[1].x === x && path.points[1].y === y)
  ) && (
  // Don't remove "fixed" paths i.e. under yurts
    !path.points[0].fixed && !path.points[1].fixed
  ));

  pathsToRemove.forEach((pathToRemove) => {
    if (inventory.paths < 99) {
      inventory.paths++;
      pathTilesIndicatorCount.innerText = inventory.paths;
    }
    pathToRemove.remove();
  });

  if (pathsToRemove.length) playPathDeleteNote();

  drawPaths({ changedCells: [{ x, y }] });
};
