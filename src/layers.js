import { addGridToSvg } from './grid';
import { svgElement, createSvgElement } from './svg';
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

const addGridBlockLayer = () => {
  const gridBlockLayer = createSvgElement('g');
  gridBlockLayer.setAttribute('fill', 'none');
  svgElement.appendChild(gridBlockLayer);
  return gridBlockLayer;
};

const addFenceLayer = () => {
  const fenceLayer = createSvgElement('g');
  fenceLayer.setAttribute('fill', 'none');
  fenceLayer.setAttribute('stroke', colors.fence);
  svgElement.appendChild(fenceLayer);
  return fenceLayer;
};

const addPathShadowLayer = () => {
  const pathShadowLayer = createSvgElement('g');
  pathShadowLayer.setAttribute('fill', 'none');
  pathShadowLayer.setAttribute('stroke', colors.base);
  pathShadowLayer.setAttribute('stroke-width', 3);
  svgElement.appendChild(pathShadowLayer);
  return pathShadowLayer;
};

const addPathLayer = () => {
  const pathLayer = createSvgElement('g');
  pathLayer.setAttribute('fill', 'none');
  pathLayer.setAttribute('stroke', colors.path);
  pathLayer.setAttribute('stroke-width', 3);
  svgElement.appendChild(pathLayer);
  return pathLayer;
};

const addPersonShadowLayer = () => {
  const personShadowLayer = createSvgElement('g');
  personShadowLayer.setAttribute('fill', 'none');
  personShadowLayer.setAttribute('stroke', colors.shadow);
  svgElement.appendChild(personShadowLayer);
  return personShadowLayer;
}

const addPersonLayer = () => {
  const personLayer = createSvgElement('g');
  personLayer.setAttribute('fill', 'none');
  svgElement.appendChild(personLayer);
  return personLayer;
}

const addYurtShadowLayer = () => {
  const yurtShadowLayer = createSvgElement('g');
  yurtShadowLayer.setAttribute('fill', 'none');
  yurtShadowLayer.setAttribute('stroke', colors.shadow);
  svgElement.appendChild(yurtShadowLayer);
  return yurtShadowLayer;
};

const addYurtLayer = () => {
  const yurtLayer = createSvgElement('g');
  yurtLayer.setAttribute('fill', colors.yurt);
  svgElement.appendChild(yurtLayer);
  return yurtLayer;
};

const addYurtDecorationLayer = (color) => {
  const yurtDecorationLayer = createSvgElement('g');
  yurtDecorationLayer.setAttribute('fill', 'none');
  yurtDecorationLayer.setAttribute('stroke', color);
  svgElement.appendChild(yurtDecorationLayer);
  return yurtDecorationLayer;
};

const addPinLayer = () => {
  const pinLayer = createSvgElement('g');
  svgElement.appendChild(pinLayer);
  return pinLayer;
}

const addPointerLayer = () => {
  const pointerLayer = createSvgElement('g');
  svgElement.appendChild(pointerLayer);
  return pointerLayer;
}

// Order is important here, because it determines stacking in the SVG
export const layers = {
  grid: addGridToSvg(),
  gridBlock: addGridBlockLayer(),
  pathShadows: addPathShadowLayer(),
  paths: addPathLayer(),
  fenceShadows: addFenceShadowLayer(),
  fences: addFenceLayer(),
  // personShadows: addPersonShadowLayer(),
  // personLayer: addPersonLayer(),
  animalShadows: addAnimalShadowLayer(),
  animals: addAnimalLayer(),
  yurtShadows: addYurtShadowLayer(),
  yurts: addYurtLayer(),
  yurtDecorationLayers: {
    'ox': addYurtDecorationLayer(colors.ox),
    'goat': addYurtDecorationLayer(colors.goat),
  },

  // Temporarily on top for testing
  personShadows: addPersonShadowLayer(),
  personLayer: addPersonLayer(),

  pinLayer: addPinLayer(),
  pointerLayer: addPointerLayer(),
};

export const { yurtDecorationLayers } = layers;
export const animalLayer = layers.animals;
export const animalShadowLayer = layers.animalShadows;
export const fenceLayer = layers.fences;
export const fenceShadowLayer = layers.fenceShadows;
export const gridBlockLayer = layers.gridBlock;
export const pathLayer = layers.paths;
export const pathShadowLayer = layers.pathShadows;
export const personLayer = layers.personLayer;
export const personShadowLayer = layers.personShadows;
export const pinLayer = layers.pinLayer;
export const pointerLayer = layers.pointerLayer;
export const yurtLayer = layers.yurts;
export const yurtShadowLayer = layers.yurtShadows;
