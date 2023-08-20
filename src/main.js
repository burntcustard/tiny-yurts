import { init, GameLoop } from 'kontra';
import { Yurt } from './yurt';
import { svgElement } from './svg';
import { initPointer } from './pointer';
import { OxFarm } from './ox-farm';

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

// const testPath1 = new Path({ points: [{ x: 0, y: 1 }, { x: 1, y: 1}]} );
// const testPath2 = new Path({ points: [{ x: 1, y: 1 }, { x: 2, y: 1}]} );
// const testPath3 = new Path({ points: [{ x: 2, y: 1 }, { x: 2, y: 2}]} );
// const testPath4 = new Path({ points: [{ x: 2, y: 2 }, { x: 1, y: 2}]} );
// const testPath5 = new Path({ points: [{ x: 1, y: 2 }, { x: 0, y: 3}]} );
// const testPath6 = new Path({ points: [{ x: 0, y: 3 }, { x: 0, y: 4}]} );
// const testPath7 = new Path({ points: [{ x: 0, y: 4 }, { x: 1, y: 4}]} );
// const testPath8 = new Path({ points: [{ x: 1, y: 4 }, { x: 2, y: 4}]} );
// const testPath9 = new Path({ points: [{ x: 2, y: 4 }, { x: 3, y: 4}]} );
// const testPath10 = new Path({ points: [{ x: 2, y: 4 }, { x: 2, y: 5}]} );

// const testPathA = new Path({ points: [{ x: 5, y: 1 }, { x: 6, y: 1}]} );
// const testPathB = new Path({ points: [{ x: 6, y: 1 }, { x: 6, y: 2}]} );
// const testPathC = new Path({ points: [{ x: 6, y: 2 }, { x: 5, y: 2}]} );
// const testPathD = new Path({ points: [{ x: 5, y: 2 }, { x: 5, y: 1}]} );
// // const testPath4 = new Path({ points: [{ x: 2, y: 2 }, { x: 3, y: 3}]} );

// const testPathE = new Path({ points: [{ x: 3, y: 5 }, { x: 2, y: 4 }]});

// drawPaths();

setTimeout(() => {
const testYurt = new Yurt({ x: 6, y: 7, type: 'ox' });
  testYurt.addToSvg();
}, 500);

// setTimeout(() => {
//   testYurt.rotateTo(2, 4);
// }, 1000);

setTimeout(() => {
  const testYurt2 = new Yurt({ x: 5, y: 4, type: 'goat' });
  testYurt2.addToSvg();
}, 2000);

let testFarm;

setTimeout(() => {
  testFarm = new OxFarm({ width: 3, height: 2, x: 1, y: 6 });
}, 3000);

initPointer(svgElement);

const loop = GameLoop({
  update() {
    testFarm.update();
  },
  render() {
    testFarm.render();
  },
});

setTimeout(() => {
  loop.start();
}, 4000);
