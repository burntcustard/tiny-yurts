import { addGridToSvg } from './grid';
import { svgElement, createSvgElement } from './svg';
import { pathSvgWidth } from './path';
import { colors } from './colors';

const addAnimalShadowLayer = () => {
  const animalShadowLayer = createSvgElement('g');
  animalShadowLayer.setAttribute('transform', 'translate(.3,.3)');
  svgElement.appendChild(animalShadowLayer);
  return animalShadowLayer;
};

const addAnimalLayer = () => {
  const animalLayer = createSvgElement('g');
  svgElement.appendChild(animalLayer);
  return animalLayer;
};

const addFenceShadowLayer = () => {
  const fenceShadowLayer = createSvgElement('g');
  fenceShadowLayer.setAttribute('fill', 'none');
  fenceShadowLayer.setAttribute('stroke', colors.shadow);
  fenceShadowLayer.setAttribute('transform', 'translate(.5,.5)');
  svgElement.appendChild(fenceShadowLayer);
  return fenceShadowLayer;
};

const addFenceLayer = () => {
  const fenceLayer = createSvgElement('g');
  fenceLayer.setAttribute('fill', 'none');
  fenceLayer.setAttribute('stroke', colors.fence);
  svgElement.appendChild(fenceLayer);
  return fenceLayer;
};

const addPathLayer = () => {
  const pathLayer = createSvgElement('g');
  pathLayer.setAttribute('fill', 'none');
  pathLayer.setAttribute('stroke', colors.path);
  pathLayer.setAttribute('stroke-linecap', 'round');
  // stroke-linejoin might not be needed(?)
  pathLayer.setAttribute('stroke-linejoin', 'round');
  pathLayer.setAttribute('stroke-width', pathSvgWidth);
  svgElement.appendChild(pathLayer);
  return pathLayer;
};

const addYurtLayer = () => {
  const yurtLayer = createSvgElement('g');
  yurtLayer.setAttribute('fill', colors.yurt);
  svgElement.appendChild(yurtLayer);
  return yurtLayer;
};

const addYurtShadowLayer = () => {
  const yurtShadowLayer = createSvgElement('g');
  yurtShadowLayer.setAttribute('fill', 'none');
  yurtShadowLayer.setAttribute('stroke-linecap', 'round');
  yurtShadowLayer.setAttribute('stroke', colors.shadow);
  svgElement.appendChild(yurtShadowLayer);
  return yurtShadowLayer;
};

const addYurtDecorationLayer = (color) => {
  const yurtDecorationLayer = createSvgElement('g');
  yurtDecorationLayer.setAttribute('fill', 'none');
  yurtDecorationLayer.setAttribute('stroke', color);
  svgElement.appendChild(yurtDecorationLayer);
  return yurtDecorationLayer;
};

const addPointerLayer = () => {
  const pointerLayer = createSvgElement('g');
  return pointerLayer;
}

// Order is important here, because it determines stacking in the SVG
export const layers = {
  grid: addGridToSvg(),
  fenceShadows: addFenceShadowLayer(),
  fences: addFenceLayer(),
  paths: addPathLayer(),
  animalShadows: addAnimalShadowLayer(),
  animals: addAnimalLayer(),
  yurtShadows: addYurtShadowLayer(),
  yurts: addYurtLayer(),
  yurtDecorationLayers: {
    ox: addYurtDecorationLayer(colors.ox),
    goat: addYurtDecorationLayer(colors.goat),
  },
  pointerLayer: addPointerLayer(),
};

export const animalShadowLayer = layers.animalShadows;
export const animalLayer = layers.animals;
export const fenceLayer = layers.fences;
export const fenceShadowLayer = layers.fenceShadows;
export const pathLayer = layers.paths;
export const { yurtDecorationLayers } = layers;
export const yurtLayer = layers.yurts;
export const yurtShadowLayer = layers.yurtShadows;
