import { init, Sprite, GameLoop } from 'kontra';

import { createSvgElement } from './svg';
import { Yurt } from './yurt';
import { Farm } from './farm';

const { canvas } = init();

const sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 20,     // width and height of the sprite rectangle
  height: 40,
  dx: 2          // move the sprite 2px to the right every frame
});

/**
 * TODO: Add layer groups to SVG:
 * - paths
 * - yurt shadows
 * - yurts
 * - people
 */

const testYurt = new Yurt({ x: 2, y: 3, type: 'ox' });
testYurt.addToSvg();

const testYurt2 = new Yurt({ x: 5, y: 4, type: 'goat' });
setTimeout(() => {
  testYurt2.addToSvg();
}, 1000);

const testFarm = new Farm({ x: 1, y: 6, type: 'ox' });
setTimeout(() => {
  testFarm.addToSvg();
}, 2000);

for (let i = 0; i < 30; i++) {
  setTimeout(() => {
    testFarm.addAnimal();
  }, 3500 + i * 500);
}

const loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
      sprite.x = -sprite.width;
    }
  },
  render: function() { // render the game state
    sprite.render();
  }
});

loop.start();    // start the game
