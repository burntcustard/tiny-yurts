import { Yurt, yurts } from './yurt';
import { farms } from './farm';
import { paths } from './path';
import { ponds, spawnPond } from './pond';
import { OxFarm } from './ox-farm';
import { GoatFarm } from './goat-farm';
import {
  boardOffsetX, boardOffsetY, boardWidth, boardHeight, gridHeight, gridWidth,
} from './svg';
import { weightedRandom } from './weighted-random';
import { FishFarm, fishFarms } from './fish-farm';
import { shuffle } from './shuffle';
import { colors } from './colors';
import { Tree, trees } from './tree';

const farmTypes = [colors.ox, colors.goat];
const spawningLoopLength = 3000;

const getRandomNewType = () => {
  if (farms.length < farmTypes.length) {
    // If you haven't got a goat farm yet, spawn one
    return farmTypes[farms.length];
  }

  const goodRatioTypes = farmTypes
    .filter((t) => {
      // console.log(t);
      const yurtsOfThisType = yurts.filter((y) => y.type === t);
      const farmsOfThisType = farms.filter((f) => f.type === t);
      // console.log(yurtsOfThisType);
      // console.log(farmsOfThisType);
      return yurtsOfThisType.length > farmsOfThisType.length;
    });
  // console.log(goodRatioTypes);

  return goodRatioTypes.at(Math.random() * goodRatioTypes.length);
};

const getRandomExistingType = () => {
  if (farms.length < farmTypes.length) {
    return farmTypes[farms.length - 1];
  }

  const yurtTypeCounts = {};
  yurts.filter((y) => y.type !== colors.fish).forEach((yurt) => {
    yurtTypeCounts[yurt.type] = yurtTypeCounts[yurt.type] ? yurtTypeCounts[yurt.type] + 1 : 1;
  });

  const farmTypeCounts = {};
  farms.filter((y) => y.type !== colors.fish).forEach((farm) => {
    farmTypeCounts[farm.type] = farmTypeCounts[farm.type] ? farmTypeCounts[farm.type] + 1 : 1;
  });

  const weights = [];
  Object.keys(farmTypeCounts).forEach((type) => {
    weights.push(farmTypeCounts[type] / yurtTypeCounts[type]);
  });

  const newType = Object.keys(farmTypeCounts)[weightedRandom(weights)];

  return newType;
};

export const getRandomPosition = ({
  width = 1,
  height = 1,
  anchor = {
    x: gridWidth / 2, y: gridHeight / 2, width: 0, height: 0,
  },
  minDistance = 0,
  maxDistance = 99,
  maxNumAttempts = 9, // TODO: Clever ways to not hit this. >8 makes game go sloww
  avoidTrees = true,
  extra = { x: 0, y: 0 }, // relative to x/y
}) => {
  let numAttempts = 0;

  while (numAttempts < maxNumAttempts) {
    numAttempts++;

    const minX = Math.max(
      boardOffsetX,
      anchor.x - maxDistance,
    );
    const maxX = Math.min(
      boardOffsetX + boardWidth - width + 1,
      anchor.x + anchor.width + maxDistance - width + 1,
    );
    const minY = Math.max(
      boardOffsetY,
      anchor.y - maxDistance,
    );
    const maxY = Math.min(
      boardOffsetY + boardHeight - height + 1,
      anchor.y + anchor.height + maxDistance - height + 1,
    );

    const x = Math.floor(minX + (Math.random() * (maxX - minX)));
    const y = Math.floor(minY + (Math.random() * (maxY - minY)));

    // Check if too close to position
    if (
      x < anchor.x + anchor.width + minDistance - 1
      && x > anchor.x - minDistance - width + 1
      && y < anchor.y + anchor.height + minDistance - 1
      && y > anchor.y - minDistance - height + 1
    ) continue;

    // Extra bit of path is off the edge of the game board
    if (
      x + extra.x < boardOffsetX
      || x + extra.x > boardOffsetX + boardWidth - 1
      || y + extra.y < boardOffsetY
      || y + extra.y > boardOffsetY + boardHeight - 1
    ) {
      continue;
    }

    // TODO: Allow spawning of some things on ponds?
    const pondObstruction = ponds.some((pond) => pond.avoidancePoints.some((pondCell) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (x + w === pondCell.x && y + h === pondCell.y) return true;
        }
      }

      if (x + extra.x === pondCell.x && y + extra.y === pondCell.y) {
        return true;
      }

      return false; // TODO: See if removing saves bytes
    }));
    if (pondObstruction) continue;

    const farmObstruction = farms.some((farm) => farm.points.some((farmCell) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (x + w === farmCell.x && y + h === farmCell.y) return true;
        }
      }

      return false; // TODO: See if removing saves bytes
    }));
    if (farmObstruction) continue;

    const pointOverlapsWithExtra = (point) => point.x === x + extra.x && point.y === y + extra.y;

    const farmExtraObstruction = farms.some((farm) => farm.points.some(pointOverlapsWithExtra));
    if (farmExtraObstruction) continue;

    // All yurts have paths underneath them so we don't need to check for this
    // const yurtObstruction = yurts.some(yurt => {
    //   for (let w = 0; w < width; w++) {
    //     for (let h = 0; h < height; h++) {
    //       if (x + w === yurt.x && y + h === yurt.y) return true;
    //     }
    //   }
    // });
    // if (yurtObstruction) continue;

    const pathObstruction = paths.some((path) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (
            (x + w === path.points[0].x && y + h === path.points[0].y)
            || (x + w === path.points[1].x && y + h === path.points[1].y)
          ) {
            return true;
          }
        }
      }

      // Paths should not block new farm or yurt paths (extra is always a path
      // it seems) - so this has been commented out as a simple fix!
      // if (
      //   (x + extra.x === path.points[0].x && y + extra.y === path.points[0].y)
      //   || (x + extra.x === path.points[1].x && y + extra.y === path.points[1].y)
      // ) {
      //   return true;
      // }

      return false; // TODO: See if removing saves bytes
    });
    if (pathObstruction) continue;

    // Now we're not checking for path obstructions on 'extra' (newly spawning paths),
    // we have to check if there's a yurt in the 'extra' cell. This wasn't needed
    // previously, beause yurts always have paths under them and the path was detected
    const yurtObstruction = yurts.some((yurt) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (x + w === yurt.x && y + h === yurt.y) {
            return true;
          }
        }
      }

      if (x + extra.x === yurt.x && y + extra.y === yurt.y) {
        return true;
      }

      return undefined; // Maybe gets minified out?
    });
    if (yurtObstruction) continue;

    if (avoidTrees) {
      const treeObstruction = trees.some((tree) => {
        for (let w = 0; w < width; w++) {
          for (let h = 0; h < height; h++) {
            if (x + w === tree.x && y + h === tree.y) {
              return true;
            }
          }
        }

        if (x + extra.x === tree.x && y + extra.y === tree.y) {
          return true;
        }

        return undefined; // Maybe gets minified out?
      });
      if (treeObstruction) continue;
    }

    return ({ x, y });
  }

  // console.log('didnt manage to find somewhere boo');
  return undefined; // TODO: See if removing saves bytes
};

const getRandomFarmProps = () => {
  const portrait = Math.random() > 0.5;
  const randWidthHeight = portrait ? { w: 2, h: 3 } : { w: 3, h: 2 };

  const farmProps = {
    width: randWidthHeight.w,
    height: randWidthHeight.h,
  };

  if (!farms.length) {
    const randPathPosX1 = Math.floor(Math.random() * randWidthHeight.w);
    const randPathPosY1 = Math.floor(Math.random() * randWidthHeight.h);
    const randPathPosX2 = portrait ? randPathPosX1 * 3 - 1 : randPathPosX1;
    const randPathPosY2 = portrait ? randPathPosY1 : randPathPosY1 * 3 - 1;

    farmProps.relativePathPoints = [
      { x: randPathPosX1, y: randPathPosY1 },
      { x: randPathPosX2, y: randPathPosY2 },
    ];
  }

  return farmProps;
};

const getRandomYurtProps = () => {
  // Which way is the yurt facing (randomly up/down/left/right to start)
  // TODO: Less disguisting way to determine initial direction
  // TODO: Disallow spawning facing into another yurt cell
  const facingInt = Math.random();
  let facing;

  if (facingInt < 0.25) {
    facing = { x: 0, y: -1 };
  } else if (facingInt < 0.5) {
    facing = { x: 1, y: 0 };
  } else if (facingInt < 0.75) {
    facing = { x: 0, y: 1 };
  } else {
    facing = { x: -1, y: 0 };
  }

  return ({
    facing,
  });
};

let updateRandomness1 = 0;
let updateRandomness2 = 0;
let updateRandomness3 = 0;
let updateRandomness4 = 0;

const spawnInfo = {
  yurtFailed: false,
};

export const spawnNewObjects = (updateCount, delay) => {
  let upgradedThisLoop = false;

  if (updateCount % spawningLoopLength === 0) {
    updateRandomness1 = Math.floor(Math.random() * 200);
    updateRandomness2 = Math.floor(Math.random() * 200);
    updateRandomness3 = Math.floor(Math.random() * 200);
    updateRandomness4 = Math.floor(Math.random() * 200);
  }

  if (updateCount === 0) {
    if (Math.random() > 0.5) {
      const width = 6;
      const height = 4;

      const randomPosition = getRandomPosition({
        width,
        height,
        minDistance: 5,
        maxNumAttempts: 32, // This could take a while, but it's required
      });

      if (randomPosition) {
        spawnPond({
          width,
          height,
          x: randomPosition.x,
          y: randomPosition.y,
        });
      }
    } else {
      const randomPosition1 = getRandomPosition({
        width: 4,
        height: 4,
        minDistance: 5,
        maxNumAttempts: 16,
      });

      if (randomPosition1) {
        spawnPond({
          width: 4,
          height: 4,
          x: randomPosition1.x,
          y: randomPosition1.y,
        });
      }

      const randomPosition2 = getRandomPosition({
        width: 3,
        height: 2,
        minDistance: 5,
        maxNumAttempts: 16,
      });

      if (randomPosition2) {
        spawnPond({
          width: 3,
          height: 2,
          x: randomPosition2.x,
          y: randomPosition2.y,
        });
      }

      const randomPosition3 = getRandomPosition({
        width: 3,
        height: 2,
        minDistance: 5,
        maxNumAttempts: 16,
      });

      if (randomPosition3) {
        spawnPond({
          width: 3,
          height: 2,
          x: randomPosition3.x,
          y: randomPosition3.y,
        });
      }
    }

    // Always 9 starting trees?
    for (let i = 0; i < 9; i++) {
      const randomPosition = getRandomPosition({});
      new Tree({
        x: randomPosition.x,
        y: randomPosition.y,
      });
    }
  }

  // Spawn the first farm, early on, near the center
  if (
    (updateCount === 0)
    || (
      updateCount > 1000
      && updateCount % spawningLoopLength === 0 + (farms.length ? updateRandomness1 : 0)
    )
  ) {
    if (updateCount > 10000 && !fishFarms.length) {
      // Find 4x4 water
      const bigPond = ponds.find((pond) => pond.width >= 4 && pond.height >= 4);
      const pathPosX1 = bigPond.x < gridWidth / 2 ? 1 : 0;
      const pathPosX2 = bigPond.x < gridWidth / 2 ? 2 : -1;
      const pathPosX3 = bigPond.x < gridWidth / 2 ? 3 : -2;
      const pathPosY1 = bigPond.y < gridHeight / 2 ? 1 : 0;
      const x = bigPond.x + bigPond.width / 2 - 1;
      const y = bigPond.y + bigPond.height / 2 - 1;

      new FishFarm({
        x,
        y,
        relativePathPoints: [
          {
            x: pathPosX1, y: pathPosY1, fixed: true, stone: true,
          },
          {
            x: bigPond.width > 4 ? pathPosX3 : pathPosX2, y: pathPosY1, fixed: true, stone: true,
          },
        ],
      });
    } else {
      const { width, height, relativePathPoints } = getRandomFarmProps();
      const type = getRandomNewType();

      const randomPosition = getRandomPosition({
        width,
        height,
        anchor: farms.length > 1 // So for the 3rd farm...
          ? yurts.filter((y) => y.type === type).at(Math.random() * yurts.length)
          : farms[farms.length - 1], // if undefined randomPosition will use default
        maxDistance: farms.length + 2,
        minDistance: farms.length ? 2 : 0,
        // We _need_ this to work on 1st loop otherwise the menu breaks.
        // Setting to 32 is sometimes slow, but it's pretty reliable, and small
        maxNumAttempts: 32,
        extra: relativePathPoints
          ? { x: relativePathPoints[1].x, y: relativePathPoints[1].y }
          : { x: 0, y: 0 }, // i.e none
        avoidTrees: false,
      });

      // Can't find a position, so instead try to upgrade a farm instead
      if (!randomPosition) {
        const shuffledFarms = shuffle(farms);

        for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
          if (shuffledFarms[i].upgrade()) {
            upgradedThisLoop = true;
          }
        }

        return;
      }

      let newFarm;

      if (type === colors.ox) {
        newFarm = new OxFarm({
          width,
          height,
          x: randomPosition.x,
          y: randomPosition.y,
          relativePathPoints,
          delay,
        });
      } if (type === colors.goat) {
        newFarm = new GoatFarm({
          width,
          height,
          x: randomPosition.x,
          y: randomPosition.y,
          relativePathPoints,
          delay, // TODO: See if having this in every new farm call saves bytes
        });
      }

      if (newFarm) {
        trees
          .filter((t) => newFarm.points.some((p) => p.x === t.x && p.y === t.y))
          .forEach((tree) => tree.remove());
        return;
      }
    }
  }

  // Spawn the first yurt really soon after
  if (updateCount % spawningLoopLength === 500 + (farms.length > 1 ? updateRandomness2 : 0)) {
    const { facing } = getRandomYurtProps();
    // Using a ternary here saves having a few more variables
    // eslint-disable-next-line no-nested-ternary
    const farm = (
      farms.filter((f) => f.type === colors.fish).length
      && yurts.filter((y) => y.type === colors.fish).length < 2
    )
      ? farms.find((f) => f.type === colors.fish)
      : farms.length > 2
        ? farms.at(Math.random() * farms.length)
        : farms[farms.length - 1];

    const randomPosition = getRandomPosition({
      anchor: {
        x: farm.x,
        y: farm.y,
        width: farm.width,
        height: farm.height,
      },
      minDistance: 3,
      maxDistance: 2 + farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type: farm.type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
    }

    return;
  }

  // If the first yurt spawn attempt failed, try again ~400ms later
  if (updateCount % spawningLoopLength === 600 + updateRandomness2 && spawnInfo.yurtFailed) {
    const { facing } = getRandomYurtProps();
    // Using a ternary here saves having a few more variables
    // eslint-disable-next-line no-nested-ternary
    const farm = (
      farms.filter((f) => f.type === colors.fish).length
      && yurts.filter((y) => y.type === colors.fish).length < 2
    )
      ? farms.find((f) => f.type === colors.fish)
      : farms.length > 2
        ? farms.at(Math.random() * farms.length)
        : farms[farms.length - 1];
    // console.log('trying to spawn a yurt of type:', farm.type);
    const randomPosition = getRandomPosition({
      anchor: {
        x: farm.x,
        y: farm.y,
        width: farm.width,
        height: farm.height,
      },
      minDistance: 3,
      maxDistance: 2 + farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type: farm.type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
    }

    return;
  }

  // If the first yurt re-spawn attempt failed, try AGAIN ~400ms later
  if (updateCount % spawningLoopLength === 700 + updateRandomness2 && spawnInfo.yurtFailed) {
    const { facing } = getRandomYurtProps();
    // Using a ternary here saves having a few more variables
    // eslint-disable-next-line no-nested-ternary
    const farm = (
      farms.filter((f) => f.type === colors.fish).length
      && yurts.filter((y) => y.type === colors.fish).length < 2
    )
      ? farms.find((f) => f.type === colors.fish)
      : farms.length > 2
        ? farms.at(Math.random() * farms.length)
        : farms[farms.length - 1];
    // console.log('trying to spawn a yurt of type:', farm.type);
    const randomPosition = getRandomPosition({
      anchor: {
        x: farm.x,
        y: farm.y,
        width: farm.width,
        height: farm.height,
      },
      minDistance: 3,
      maxDistance: 2 + farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type: farm.type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
    }

    return;
  }

  if (updateCount % spawningLoopLength === 1500 + updateRandomness3) {
    const { facing } = getRandomYurtProps();
    const type = getRandomExistingType();
    const sameTypeYurts = yurts.filter((y) => y.type === type);
    const friendYurt = sameTypeYurts.at(Math.random() * sameTypeYurts.length);
    // if (!friendYurt) return; // Silent skip if somehow 1st yurt didnt exist

    const randomPosition = getRandomPosition({
      anchor: {
        x: friendYurt.x,
        y: friendYurt.y,
        width: 1,
        height: 1,
      },
      minDistance: 1,
      maxDistance: farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
      // console.log('2nd yurt failed to spawn')
    }

    return;
  }

  // 2nd yurt spawn re-attempt after ~400ms
  if ((updateCount % spawningLoopLength === 1600 + updateRandomness3) && spawnInfo.yurtFailed) {
    const { facing } = getRandomYurtProps();
    const type = getRandomExistingType();
    const sameTypeYurts = yurts.filter((y) => y.type === type);
    const friendYurt = sameTypeYurts.at(Math.random() * sameTypeYurts.length);
    // if (!friendYurt) return; // Silent skip if somehow 1st yurt didnt exist

    const randomPosition = getRandomPosition({
      anchor: {
        x: friendYurt.x,
        y: friendYurt.y,
        width: 1,
        height: 1,
      },
      minDistance: 1,
      maxDistance: farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
      // console.log('2nd yurt failed to spawn again')
    }

    return;
  }

  // 2nd yurt spawn re-re-attempt after ~400ms
  if ((updateCount % spawningLoopLength === 1700 + updateRandomness3) && spawnInfo.yurtFailed) {
    const { facing } = getRandomYurtProps();
    const type = getRandomExistingType();
    const sameTypeYurts = yurts.filter((y) => y.type === type);
    const friendYurt = sameTypeYurts.at(Math.random() * sameTypeYurts.length);
    // if (!friendYurt) return; // Silent skip if somehow 1st yurt didnt exist

    const randomPosition = getRandomPosition({
      anchor: {
        x: friendYurt.x,
        y: friendYurt.y,
        width: 1,
        height: 1,
      },
      minDistance: 1,
      maxDistance: farms.length,
      extra: facing,
    });

    if (randomPosition) {
      new Yurt({
        x: randomPosition.x,
        y: randomPosition.y,
        type,
        facing,
      });
      spawnInfo.yurtFailed = false;
    } else {
      spawnInfo.yurtFailed = true;
      // console.log('2nd yurt failed to spawn again again')
    }

    return;
  }

  // Extra farm/upgrade attempt every update, not long before the per-round farm/upgrade
  if (updateCount % spawningLoopLength === 2500 + updateRandomness4 && updateCount > 20000) {
    const { width, height, relativePathPoints } = getRandomFarmProps();
    const type = getRandomNewType();

    const randomPosition = getRandomPosition({
      width,
      height,
      anchor: farms.length > 1 // So for the 3rd farm...
        ? yurts.filter((y) => y.type === type).at(Math.random() * yurts.length)
        : farms[farms.length - 1], // if undefined randomPosition will use default
      maxDistance: farms.length + 2,
      minDistance: farms.length ? 2 : 0,
      extra: relativePathPoints
        ? { x: relativePathPoints[1].x, y: relativePathPoints[1].y }
        : { x: 0, y: 0 }, // i.e none
      avoidTrees: false,
    });

    // Can't find a position, so instead try to upgrade a farm instead
    if (!randomPosition) {
      const shuffledFarms = shuffle(farms);

      for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
        if (shuffledFarms[i].upgrade()) {
          upgradedThisLoop = true;
        }
      }

      return;
    }

    let newFarm;

    if (type === colors.ox) {
      newFarm = new OxFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
        delay,
      });
    } if (type === colors.goat) {
      newFarm = new GoatFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
        delay, // TODO: See if having this in every new farm call saves bytes
      });
    }

    if (newFarm) {
      trees
        .filter((t) => newFarm.points.some((p) => p.x === t.x && p.y === t.y))
        .forEach((tree) => tree.remove());
    }
  }
};
