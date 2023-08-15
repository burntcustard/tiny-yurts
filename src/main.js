import { init, Sprite, GameLoop } from 'kontra';

const { canvas } = init();

const sprite = Sprite({
  x: 100,        // starting x,y position of the sprite
  y: 80,
  color: 'red',  // fill color of the sprite rectangle
  width: 20,     // width and height of the sprite rectangle
  height: 40,
  dx: 2          // move the sprite 2px to the right every frame
});

const createSvgElement = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);

const svg = createSvgElement('svg');
svg.setAttribute('width', 384);
svg.setAttribute('height', 384);
svg.setAttribute('viewBox', '0 0 72 72');
svg.style.cssText = 'background:#8a5';
document.body.appendChild(svg);

const defs = createSvgElement('defs');
svg.appendChild(defs);
const pattern = createSvgElement('pattern');
pattern.setAttribute('id', 'grid');
pattern.setAttribute('width', 8);
pattern.setAttribute('height', 8);
pattern.setAttribute('patternUnits', 'userSpaceOnUse');
defs.appendChild(pattern);
const gridPath = createSvgElement('path');
gridPath.setAttribute('d', 'M8 0L0 0 0 8');
gridPath.setAttribute('fill', 'none');
gridPath.setAttribute('stroke', '#0001');
gridPath.setAttribute('stroke-width', .5);
pattern.appendChild(gridPath);
const gridRect = createSvgElement('rect');
gridRect.setAttribute('width', '100%');
gridRect.setAttribute('height', '100%');
gridRect.setAttribute('fill', 'url(#grid)');
svg.appendChild(gridRect);

const yurt = createSvgElement('circle');
yurt.setAttribute('fill', '#fff');
yurt.setAttribute('r', 0);
yurt.setAttribute('transform', 'translate(12, 20)');
yurt.style.transition = 'all.3s';
setTimeout(() => yurt.setAttribute('r', 3), 500);
svg.appendChild(yurt);

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
