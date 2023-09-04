import { Yurt, yurts } from './yurt';
import { farms } from './farm';
import { paths } from './path';
import { ponds } from './pond';
import { OxFarm } from './ox-farm';
import { GoatFarm } from './goat-farm';
import {
  boardOffsetX, boardOffsetY, boardWidth, boardHeight, gridCellSize, gridHeight, gridWidth
} from './svg';
import { weightedRandom } from './weighted-random';
import { spawnPond } from './pond';
import { FishFarm, fishFarms } from './fish-farm';
import { shuffle } from './shuffle';
import { colors } from './colors';
import { createSvgElement } from './svg-utils';
import { pinLayer, yurtLayer } from './layers';

const farmTypes = [colors.ox, colors.goat]; // TODO: fish, crops, horses(?)
const spawningLoopLength = 2500;

export const getRandomPosition = ({
  width = 1,
  height = 1,
  anchor = {
    x: gridWidth / 2, y: gridHeight / 2, width: 0, height: 0,
  },
  minDistance = 0,
  maxDistance = 99,
  maxNumAttempts = 8, // TODO: Clever ways to not hit this. >8 makes game go sloww
  extra = { x: 0, y: 0 }, // relative to x/y
}) => {
  let numAttempts = 0;

  let anchorTestSvg;
  if (anchor.width > 0 && anchor.height > 0) {
    // Anchors that have width and height are cyan squares
    anchorTestSvg = createSvgElement('rect');
    anchorTestSvg.setAttribute('width', anchor.width * gridCellSize);
    anchorTestSvg.setAttribute('height', anchor.height * gridCellSize);
    anchorTestSvg.setAttribute('fill', '#0ff9');
  } else {
    // Anchors which are just points are yellow dots
    anchorTestSvg = createSvgElement('circle');
    anchorTestSvg.setAttribute('r', 2);
    anchorTestSvg.setAttribute('fill', '#ff09');
  }
  anchorTestSvg.style.transform = `translate(${anchor.x * gridCellSize}px,${anchor.y * gridCellSize}px)`;
  pinLayer.appendChild(anchorTestSvg);

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
      || x + extra.x > boardWidth - width
      || y + extra.y < boardOffsetY
      || y + extra.y > boardHeight - height
    ) {
      // continue;
    }

    // Check if too far away from position
    // Not needed because we no longer spam the whole map looking for spawns
    // if (
    //   x > anchor.x + maxDistance ||
    //   x < anchor.x - maxDistance ||
    //   y > anchor.y + maxDistance ||
    //   y < anchor.y - maxDistance
    // ) continue;

    // TODO: Allow spawning of some things on ponds?
    const pondObstruction = ponds.some((pond) => pond.avoidancePoints.some((pondCell) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (x + w === pondCell.x && y + h === pondCell.y) return true;
        }
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

  // console.log('Spawning new yurt with type weighting of:');
  // console.log(weights);

  // console.log(farmTypeCounts);

  const newType = Object.keys(farmTypeCounts)[weightedRandom(weights)]
  // console.log('Type chosen:', newType);

  return newType;
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

export const spawnNewObjects = (updateCount, delay) => {
  let upgradedThisLoop = false;
  let yurtFailed = false;

  if (updateCount % spawningLoopLength === 0) {
    updateRandomness1 = Math.floor(Math.random() * 200);
    updateRandomness2 = Math.floor(Math.random() * 200);
    updateRandomness3 = Math.floor(Math.random() * 200);
    updateRandomness4 = Math.floor(Math.random() * 200);
    updateRandomness5 = Math.floor(Math.random() * 200);
  }
  // console.log(updateCount);

  if (updateCount === 0) {
    for (let i = 0; i < 99; i++) {
      const width = 1;
      const height = 1;
      const randomPosition = getRandomPosition({
        width,
        height,
        // anchor: {
        //   x: 14,
        //   y: 7,
        //   width: 2,
        //   height: 2,
        // },
        minDistance: 2,
        maxDistance: 3,
        maxNumAttempts: 16,
      });
      if (randomPosition) {
        const x = randomPosition.x * gridCellSize;
        const y = randomPosition.y * gridCellSize;

        const testSvg = createSvgElement('rect');
        testSvg.setAttribute('width', 8 * width);
        testSvg.setAttribute('height', 8 * height);
        testSvg.setAttribute('stroke', '#f005');
        testSvg.setAttribute('fill', '#fff5');
        testSvg.style.transform = `translate(${x}px,${y}px)`;
        yurtLayer.appendChild(testSvg);
      }
    }

    // for (let i = 0; i < 80; i++) {
    //   const randomPosition = getRandomPosition({
    //     width: 1,
    //     height: 1,
    //     minDistance: 4,
    //     maxNumAttempts: 16,
    //   });
    //   if (randomPosition) {
    //     const x = gridCellSize / 2 + randomPosition.x * gridCellSize;
    //     const y = gridCellSize / 2 + randomPosition.y * gridCellSize;

    //     const testSvg = createSvgElement('circle');
    //     testSvg.setAttribute('r', 2);
    //     testSvg.setAttribute('fill', 'red');
    //     testSvg.style.transform = `translate(${x}px,${y}px)`;
    //     yurtLayer.appendChild(testSvg);
    //   }
    // }

    if (Math.random() > 0.5) {
      const width = 6;
      const height = 4;

      const randomPosition = getRandomPosition({
        width,
        height,
        minDistance: 5,
        maxNumAttempts: 16,
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
  }

  // Spawn the first farm, early on, near the center
  if (
    (updateCount === 0)
    ||
    (updateCount > 1000 && updateCount % spawningLoopLength === 0 + (farms.length ? updateRandomness1 : 0))
  ) {
    if (updateCount > 10000 && !fishFarms.length) {
      // Find 4x4 water
      const bigPond = ponds.find((pond) => pond.width >= 4 && pond.height >= 4);

      // bigPond.points.forEach((point) => {
      //   if (
      //     !bigPond.points.some((p) => p.x === point.x && p.y === point.y)
      //   ) {

      //   }
      // });
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
          { x: pathPosX1, y: pathPosY1, fixed: true, stone: true },
          { x: bigPond.width > 4 ? pathPosX3 : pathPosX2, y: pathPosY1, fixed: true, stone: true },
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
        maxDistance: farms.length ? farms.length * 2 : 1,
        minDistance: farms.length ? 2 : 0,
        maxNumAttempts: 16,
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

      if (type === colors.ox) {
        new OxFarm({
          width,
          height,
          x: randomPosition.x,
          y: randomPosition.y,
          relativePathPoints,
          delay,
        });
        return;
      } if (type === colors.goat) {
        new GoatFarm({
          width,
          height,
          x: randomPosition.x,
          y: randomPosition.y,
          relativePathPoints,
          delay, // TODO: See if having this in every new farm call saves bytes
        });
        return;
      }
    }
  }

  // Spawn the first yurt really soon after
  if (updateCount % spawningLoopLength === 500 + updateRandomness2) {
    const { facing } = getRandomYurtProps();
    const farm = (farms.filter((f) => f.type === colors.fish).length && yurts.filter((y) => y.type === colors.fish).length < 2)
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
    } else {
      yurtFailed = true;
    }

    return;
  }

  // If the first yurt spawn attempt failed, try again ~400ms later
  if (updateCount % spawningLoopLength === 600 + updateRandomness2 && yurtFailed) {
    const { facing } = getRandomYurtProps();
    const farm = (farms.filter((f) => f.type === colors.fish).length && yurts.filter((y) => y.type === colors.fish).length < 2)
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
      maxDistance: 3 + farms.length,
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

  if (updateCount % spawningLoopLength === 1000 + updateRandomness3 && updateCount > 4000) {
    upgradedThisLoop = false;

    const shuffledFarms = shuffle(farms);

    for (let i = 0; i < shuffledFarms.length && !upgradedThisLoop; i++) {
      if (shuffledFarms[i].upgrade()) {
        upgradedThisLoop = true;
      }
    }
  }

  if (updateCount % spawningLoopLength === 1500 + updateRandomness4) {
    const { facing } = getRandomYurtProps();
    const type = getRandomExistingType();
    const sameTypeYurts = yurts.filter((y) => y.type === type);
    const friendYurt = sameTypeYurts.at(Math.random() * sameTypeYurts.length);

    if (!friendYurt) return; // Silent skip if somehow 1st yurt didnt exist

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

  if (updateCount % spawningLoopLength === 2000 + updateRandomness5 && updateCount > 8000) {
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
