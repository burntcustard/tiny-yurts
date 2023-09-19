# Tiny Yurts

<img src="https://github.com/burntcustard/tiny-yurts/blob/main/screenshot-bigx2.png?raw=true" width="400" alt="Screenshot of the game, showing a green background, with small dots and other simple shapes representing paths, animals, trees, and a pond."/>

### [Play online](https://burnt.io/tiny-yurts/)

> A web game inspired by [Dinosaur Polo Club's](https://dinopoloclub.com/) [Mini Motorways](https://dinopoloclub.com/games/mini-motorways/), created for [Js13kGames](https://js13kgames.com/) 2023  
> \- the total size of the [zipped](dist/game.zip) [index.html](dist/index.html) is under 13,312B!

### How to play

- Touch or left click and drag to build paths between your yurts and farms to keep the animals happy!
- You get points for your total number of settlers (2x your number of yurts), plus a point for each animal.
- __Fullscreen__ is highly recommended for mobile.

### Tech used
- All the graphics are SVG-based, with CSS transitions and transforms. There is no canvas, and there are no asset files. It's HTML-CSS-SVG-in-JS all the way down.
- JavaScript packer [Roadroller](https://lifthrasiir.github.io/roadroller/) by [Kang Seonghoon](https://mearie.org/).
- [Kontra.js](https://straker.github.io/kontra/) game engine by [Steven Lambert](https://stevenklambert.com/).
- [Karplus-Strong](https://en.wikipedia.org/wiki/Karplus%E2%80%93Strong_string_synthesis) via the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), from [xem's](https://xem.github.io/) [MiniSynth](https://github.com/xem/js1k19/blob/gh-pages/miniSynth/index.html), based on [Keith Horwood's](https://keithwhor.com/) [audiosynth](https://github.com/keithwhor/audiosynth).
- [JSZip](https://stuk.github.io/jszip/) _and_ [advzip-bin](https://github.com/elliot-nelson/advzip-bin) for zip compression.
- [Vite](https://vitejs.dev/) and [Terser](https://terser.org/) with a messy, unstable, project-specific [custom plugin](plugins/vite-js13k.js) for maximum minification.

### Tips & Tricks
<details>
<summary>(Click to show - minor spoilers)</summary>  
<p>
  <ul>
    <li>You can build paths while the game is paused, if you need a little more time to think.</li>
    <li>You can delete the path that comes with the starting farm!</li>
    <li>Paths cannot be build over water, so to connect a fish farm you have to join a path to the end of the stepping stones.</li>
    <li>Distance is the most important factor when determining how well a yurt can cope with a farms demands.</li>
    <li>You don't have to connect every yurt!</li>
    <li>You can send your settlers through other farms. If the farm is of a different type, it won't interfere at all, however if it's a farm of the same type, the settlers are more likely to head there than travel through it to the further away one.</li>
    <li>Your settlers may get stuck at farms if they have no way home. You'll have to re-build a path for them to get back to their own yurt before they can help out again.</li>
    <li>Diagonal paths use fewer path tiles to go a further distance, but because they are further, it will take settlers longer to get to their destinations for the same number of grid-cells traversed.</li>
    <li>Farms have a "needyness" based on the animal type, times the number of animals minus 1, times a subtle difficulty-over-time curve. For example a farm with two adult oxen and one baby, will have 2 × [ox demand number] × [difficulty scaling].</li>
    <li>Farms issue capacity is based of the total number of adults, times 3. For example a farm with two adult oxen and one baby, will have 2 (adults) × 3 = 6 capacity, which is represented by the two starting (!) and then 4 segments in the pop-up issue indicator. This means you have to deal with farms with only two adults quickly!</li>
  <ul>
</p>
</details>

### Run locally

1. Clone this repository  
   `git clone git@github.com:burntcustard/tiny-yurts.git`

2. Install dependencies  
  `npm install`

3. Run dev command to start up hot-reloading with [Vite](https://vitejs.dev/) at [localhost:3000](http://localhost:3000/)  (you will need to open that URL yourself!)  
  `npm run dev`

4. Compile the output [index.html](dist/index.html) file and [game.zip]((dist/game.zip)) files (this will take a minute or two!)  
   `npm run build`

5. See [package.json](package.json) for other scripts
