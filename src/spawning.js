import { Yurt, yurts } from './yurt';
import { farms } from './farm';
import { paths } from './path';
import { OxFarm } from './ox-farm';
import { GoatFarm, goatFarms } from './goat-farm';
import { boardOffsetX, boardOffsetY, boardWidth, boardHeight } from './svg';

// Figure out what to spawn depending on totalUpdates & current score

const farmTypesOrder = ['ox', 'goat']; // TODO: fish, crops, horses(?)
const currentFarmTypes = [];

export const getRandomPosition = ({
  width = 1,
  height = 1,
  position = {x: 0, y: 0},
  minDistance = 0,
  maxDistance = 99,
  maxNumAttempts = 100, // TODO: Clever ways to not hit this
  extra = { x: 0, y: 0 }, // relative to x/y
}) => {
  let numAttempts = 0;
  // TODO: Check if these are inlined
  const w = width;
  const h = height;

  while (numAttempts < maxNumAttempts) {
    // +1 and -1 are to prevent spawning right on the edge of the board
    const x = Math.floor(boardOffsetX + 1 + (Math.random() * (boardWidth - w - 1)));
    const y = Math.floor(boardOffsetY + 1 + (Math.random() * (boardHeight - h - 1)));

    // Check if too close to position
    if (
      x < position.x + minDistance &&
      x > position.x - minDistance &&
      y < position.y + minDistance &&
      y > position.y - minDistance
    ) continue;

    // Check if too far away from position
    if (
      x > position.x + maxDistance ||
      x < position.x - maxDistance ||
      y > position.y + maxDistance ||
      y < position.y - maxDistance
    ) continue;

    const farmObstruction = farms.some(farm => farm.points.some((farmCell) => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (x + w === farmCell.x && y + y === farmCell.y) return true;
        }
      }
    }));
    if (farmObstruction) continue;

    const farmExtraObstruction = farms.some(farm => farm.points.some((farmCell) =>
      x + extra.x === farmCell.x && y + extra.y === farmCell.y
    ));
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

    const pathObstruction = paths.some(path => {
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          if (
            (x + w === path.points[0].x && y + h === path.points[0].y)
            ||
            (x + w === path.points[1].x && y + h === path.points[1].y)
          ) {
            return true;
          }
        }
      }
    });
    if (pathObstruction) continue;

    return ({ x, y });
  }

  console.log('didnt manage to find somewhere boo');
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
}

export const spawnNewObjects = (updateCount) => {
  // console.log(updateCount);

  // Spawn the first farm, early on, near the center, always 3w 2h
  if (updateCount === 100) {
    const { width, height, relativePathPoints } = getRandomFarmProps();

    const randomPosition = getRandomPosition({
      position: {
        x: boardWidth / 2,
        y: boardHeight / 2,
      },
      width,
      height,
      maxDistance: 2,
      extra: { x: relativePathPoints[1].x, y: relativePathPoints[1].y },
    });
    console.log(`spawned ox farm at ${randomPosition.x}, ${randomPosition.y}`);
    const newOxFarm = new OxFarm({
      width,
      height,
      x: randomPosition.x,
      y: randomPosition.y,
      relativePathPoints,
    });
    return;
  }

  // Spawn the first yurt really soon after
  if (updateCount === 500) {
    const farm1 = farms[0];
    const randomPosition = getRandomPosition({
      position: {
        x: farm1.x + farm1.width / 2 - 0.5,
        y: farm1.y + farm1.height / 2 - 0.5,
      },
      minDistance: 3,
      maxDistance: 5,
    });
    console.log(`spawned yurt at ${randomPosition.x}, ${randomPosition.y}`);
    const newYurt = new Yurt({
      x: randomPosition.x,
      y: randomPosition.y,
      type: 'ox'
    });
    return;
  }

  if (updateCount === 1500) {
    const yurt1 = yurts[0];
    const randomPosition = getRandomPosition({
      position: {
        x: yurt1.x + yurt1.width / 2 - 0.5,
        y: yurt1.y + yurt1.height / 2 - 0.5,
      },
      minDistance: 1,
      maxDistance: 2,
    });
    const newYurt = new Yurt({
      x: randomPosition.x,
      y: randomPosition.y,
      type: 'ox'
    });
    return;
  }

  // Spawn the second a medium distance away from the first
  if (updateCount === 3000) {
    const { width, height, relativePathPoints } = getRandomFarmProps();

    const randomPosition = getRandomPosition({
      width,
      height,
      position: {
        x: farms[0].x,
        y: farms[0].y,
      },
      minDistance: 4,
      maxDistance: 8,
      extra: { x: relativePathPoints[1].x, y: relativePathPoints[1].y },
    });
    console.log(`spawned goat farm at ${randomPosition.x}, ${randomPosition.y}`);
    const newGoatFarm = new GoatFarm({
      width,
      height,
      x: randomPosition.x,
      y: randomPosition.y,
      relativePathPoints,
    });
    return;
  }

  if (updateCount === 3500) {
    const farm1 = goatFarms[0];
    const randomPosition = getRandomPosition({
      position: {
        x: farm1.x + farm1.width / 2 - 0.5,
        y: farm1.y + farm1.height / 2 - 0.5,
      },
      minDistance: 3,
      maxDistance: 5,
    });
    console.log(`spawned yurt at ${randomPosition.x}, ${randomPosition.y}`);
    const newYurt = new Yurt({
      x: randomPosition.x,
      y: randomPosition.y,
      type: 'goat'
    });
    return;
  }

  if (updateCount === 4000) {
    const farm1 = goatFarms[0];
    const randomPosition = getRandomPosition({
      position: {
        x: farm1.x + farm1.width / 2 - 0.5,
        y: farm1.y + farm1.height / 2 - 0.5,
      },
      minDistance: 3,
      maxDistance: 5,
    });
    console.log(`spawned yurt at ${randomPosition.x}, ${randomPosition.y}`);
    const newYurt = new Yurt({
      x: randomPosition.x,
      y: randomPosition.y,
      type: 'goat'
    });
    return;
  }

  if (updateCount > 4000 && updateCount % 1250 === 0) {
    const { width, height, relativePathPoints } = getRandomFarmProps();

    const randomPosition = getRandomPosition({
      width,
      height,
      extra: { x: relativePathPoints[1].x, y: relativePathPoints[1].y },
    });

    if (Math.random() > 0.5) {
      const newGoatFarm = new GoatFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
      });
    } else {
      const newOxFarm = new OxFarm({
        width,
        height,
        x: randomPosition.x,
        y: randomPosition.y,
        relativePathPoints,
      });
    }
    return;
  }

  if (updateCount > 4000 && (updateCount % 1500 === 0 || updateCount % 1750 === 0)) {
    const randomPosition = getRandomPosition({});
    const newYurt = new Yurt({
      x: randomPosition.x,
      y: randomPosition.y,
      type: Math.random() > 0.5 ? 'goat' : 'ox',
    });
    return;
  }
}
