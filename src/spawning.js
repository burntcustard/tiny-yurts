import { Yurt, yurts } from './yurt';
import { farms } from './farm';
import { paths } from './path';
import { OxFarm } from './ox-farm';
import { GoatFarm } from './goat-farm';
import {
  boardOffsetX, boardOffsetY, boardWidth, boardHeight,
} from './svg';
import { weightedRandom } from './weighted-random';

// Figure out what to spawn depending on totalUpdates & current score

const farmTypes = ['ox', 'goat']; // TODO: fish, crops, horses(?)
const spawningLoopLength = 3000;

export const getRandomPosition = ({
  width = 1,
  height = 1,
  anchor = {
    x: boardWidth / 2 + 0.5, y: boardHeight / 2 + 0.5, width: 1, height: 1,
  },
  minDistance = 0,
  maxDistance = 99,
  maxNumAttempts = 8, // TODO: Clever ways to not hit this. >8 makes game go sloww
  extra = { x: 0, y: 0 }, // relative to x/y
}) => {
  let numAttempts = 0;

  while (numAttempts < maxNumAttempts) {
    numAttempts++;
    // +1 and -1 are to prevent spawning right on the edge of the board
    const minX = Math.max(
      boardOffsetX,
      anchor.x - maxDistance,
    );
    const maxX = Math.min(
      boardOffsetX + boardWidth - width + 1,
      anchor.x + anchor.width + maxDistance,
    );
    const minY = Math.max(
      boardOffsetY,
      anchor.y - maxDistance,
    );
    const maxY = Math.min(
      boardOffsetY + boardHeight - height + 1,
      anchor.y + anchor.height + maxDistance,
    );

    const x = Math.floor(minX + (Math.random() * (maxX - minX)));
    const y = Math.floor(minY + (Math.random() * (maxY - minY)));

    // Check if too close to position
    if (
      x < anchor.x + anchor.width + minDistance - 1
      && x > anchor.x - minDistance
      && y < anchor.y + anchor.height + minDistance - 1
      && y > anchor.y - minDistance
    ) continue;

    // // Check if too far away from position
    // if (
    //   x > anchor.x + maxDistance ||
    //   x < anchor.x - maxDistance ||
    //   y > anchor.y + maxDistance ||
    //   y < anchor.y - maxDistance
    // ) continue;

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

      if (
        (x + extra.x === path.points[0].x && y + extra.y === path.points[0].y)
        || (x + extra.x === path.points[1].x && y + extra.y === path.points[1].y)
      ) {
        return true;
      }

      return false; // TODO: See if removing saves bytes
    });
    if (pathObstruction) continue;

    return ({ x, y });
  }

  // console.log('didnt manage to find somewhere boo');
  return null; // TODO: See if removing saves bytes
};

const getRandomFarmProps = () => {
  const portrait = Math.random() > 0.5;
  const randWidthHeight = portrait ? { w: 2, h: 3 } : { w: 3, h: 2 };
  const randPathPosX1 = Math.floor(Math.random() * randWidthHeight.w);
  const randPathPosY1 = Math.floor(Math.random() * randWidthHeight.h);
  const randPathPosX2 = portrait ? randPathPosX1 * 3 - 1 : randPathPosX1;
  const randPathPosY2 = portrait ? randPathPosY1 : randPathPosY1 * 3 - 1;

  return ({
    width: randWidthHeight.w,
    height: randWidthHeight.h,
    relativePathPoints: [
      { x: randPathPosX1, y: randPathPosY1 },
      { x: randPathPosX2, y: randPathPosY2 },
    ],
  });
};

const getRandomNewType = () => (farms.length < farmTypes.length
  ? farmTypes[farms.length]
  : farmTypes.at(Math.random() * farmTypes.length));

const getRandomExistingType = () => {
  if (farms.length < farmTypes.length) {
    return farmTypes[farms.length - 1];
  }

  const yurtTypeCounts = {};
  yurts.forEach((yurt) => {
    yurtTypeCounts[yurt.type] = yurtTypeCounts[yurt.type] ? yurtTypeCounts[yurt.type] + 1 : 1;
  });

  const farmTypeCounts = {};
  farms.forEach((farm) => {
    farmTypeCounts[farm.type] = farmTypeCounts[farm.type] ? farmTypeCounts[farm.type] + 1 : 1;
  });

  const weights = [];
  Object.keys(farmTypeCounts).forEach((type) => {
    weights.push(farmTypeCounts[type] / yurtTypeCounts[type]);
  });

  return Object.keys(farmTypeCounts)[weightedRandom(weights)];
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
let updateRandomness5 = 0;

export const spawnNewObjects = (updateCount) => {
  let upgradedThisLoop = false;

  if (updateCount % spawningLoopLength === 0) {
    updateRandomness1 = Math.floor(Math.random() * 200);
    updateRandomness2 = Math.floor(Math.random() * 200);
    updateRandomness3 = Math.floor(Math.random() * 200);
    updateRandomness4 = Math.floor(Math.random() * 200);
    updateRandomness5 = Math.floor(Math.random() * 200);
  }
  // console.log(updateCount);

  // Spawn the first farm, early on, near the center
  if (updateCount % spawningLoopLength === 100 + (farms.length ? updateRandomness1 : 0)) {
    const { width, height, relativePathPoints } = getRandomFarmProps();
    const type = getRandomNewType();

    const randomPosition = getRandomPosition({
      width,
      height,
      anchor: farms.length > 1 // So for the 3rd farm...
        ? yurts.filter((y) => y.type === type).at(Math.random() * yurts.length)
        : farms[farms.length - 1], // if undefined randomPosition will use default
      maxDistance: farms.length ? farms.length * 2 : 1,
      minDistance: farms.length ? 2 : 0,
      maxNumAttempts: 14,
      extra: { x: relativePathPoints[1].x, y: relativePathPoints[1].y },
    });

    // Can't find a position, so instead try to upgrade a farm instead
    if (!randomPosition) {
      const shuffledFarms = farms
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
        if (shuffledFarms[i].upgrade()) {
          upgradedThisLoop = true;
        }
      }

      return;
    }

    if (type === 'ox') {
      new OxFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
      });
      return;
    } if (type === 'goat') {
      new GoatFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
      });
      return;
    }
  }

  // Spawn the first yurt really soon after
  if (updateCount % spawningLoopLength === 500 + updateRandomness2) {
    const { facing } = getRandomYurtProps();
    const farm = farms.length > 2
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
    }

    return;
  }

  if (updateCount % spawningLoopLength === 1500 + updateRandomness3) {
    const { facing } = getRandomYurtProps();
    const type = getRandomExistingType();
    const sameTypeYurts = yurts.filter((y) => y.type === type);
    const friendYurt = sameTypeYurts.at(Math.random() * sameTypeYurts.length);

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
    }

    return;
  }

  if (updateCount % spawningLoopLength === 2000 + updateRandomness4 && upgradedThisLoop) {
    upgradedThisLoop = false;

    const shuffledFarms = farms
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
      if (shuffledFarms[i].upgrade()) {
        upgradedThisLoop = true;
      }
    }
  }

  if (updateCount % spawningLoopLength === 2500 + updateRandomness5 && upgradedThisLoop) {
    upgradedThisLoop = false;

    const shuffledFarms = farms
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
      if (shuffledFarms[i].upgrade()) {
        upgradedThisLoop = true;
      }
    }
  }
};
