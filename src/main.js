import { init, GameLoop } from 'kontra';

import { Yurt } from './yurt';
import { Farm } from './farm';

init(null, { contextless: true });

// const sprite = Sprite({
//   x: 100,        // starting x,y position of the sprite
//   y: 80,
//   color: 'red',  // fill color of the sprite rectangle
//   width: 20,     // width and height of the sprite rectangle
//   height: 40,
//   dx: 2          // move the sprite 2px to the right every frame
// });

/**
 * TODO: Add layer groups to SVG:
 * - paths
 * - yurt shadows
 * - yurts
 * - people
 */

const testYurt = new Yurt({ x: 2, y: 3, type: 'ox' });
testYurt.addToSvg();

setTimeout(() => {
  testYurt.addPath();
}, 1000);

const testYurt2 = new Yurt({ x: 5, y: 4, type: 'goat' });
setTimeout(() => {
  testYurt2.addToSvg();
}, 1000);
setTimeout(() => {
  testYurt2.addPath();
}, 2000);

const testFarm = new Farm({ x: 1, y: 6, type: 'ox' });
setTimeout(() => {
  testFarm.addToSvg();
}, 3000);

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    testFarm.addAnimal();
  }, 4500 + i * 500);
}

const loop = GameLoop({
  update() {

  },
  render() {

  },
});

loop.start();
