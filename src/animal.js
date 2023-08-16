import { GameObjectClass } from 'kontra';

export class Animal extends GameObjectClass {
  constructor(properties) {
    super(properties);
    this.roundness = properties.roundness;
  }
}
