export const weightedRandom = (weights) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulativeWeight += weights[i];

    if (randomValue < cumulativeWeight) {
      return i;
    }
  }

  return undefined;
};
