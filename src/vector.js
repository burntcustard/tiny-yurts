import { Vector } from "kontra";

/**
 * Extra vector maths, to work alongside the Vector Kontra.js object
 */

export const rotateVector = (vector, angle) => new Vector({
  x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
  y: vector.x * Math.sin(angle) - vector.y * Math.cos(angle),
});

export const combineVectors = (vectorA, vectorB) => {
  const magnitude = vectorA.length();
  const result = vectorA.add(vectorB);
  const resultMagnitude = result.length();
  const scaledResult = result.scale(magnitude / resultMagnitude);

  return scaledResult;
};
