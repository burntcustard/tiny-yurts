import { GameObjectClass } from 'kontra';

export class Structure extends GameObjectClass {
  constructor(properties) {
    super({
      ...properties,
      // Default width and height of 1 grid cell
      width: properties.width ?? 1,
      height: properties.height ?? 1,
    });

    // All structures have an array of possible connection points
    this.connections = properties.connections;
  }
}
