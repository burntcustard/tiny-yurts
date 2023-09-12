import { Vector } from 'kontra';

/**
 * This is the Kontra.js Updatable object, which GameObject extends.
 * Unfortunately Kontra doesn't export it, so we have it copy-pasted here
 * https://github.com/straker/kontra/blob/main/src/updatable.js
 *
 * Modifications:
 * - Syncing property changes (this._pc) from the parent to the child has been removed
 */
class Updatable {
  constructor(properties) {
    return this.init(properties);
  }

  init(properties = {}) {
    this.position = new Vector();
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.ttl = Infinity;
    Object.assign(this, properties);
  }

  update(dt) {
    this.advance(dt);
  }

  advance(dt) {
    let acceleration = this.acceleration;

    if (dt) {
      acceleration = acceleration.scale(dt);
    }

    this.velocity = this.velocity.add(acceleration);

    let velocity = this.velocity;

    if (dt) {
      velocity = velocity.scale(dt);
    }

    this.position = this.position.add(velocity);
    this._pc();

    this.ttl--;
  }

  get dx() {
    return this.velocity.x;
  }

  get dy() {
    return this.velocity.y;
  }

  set dx(value) {
    this.velocity.x = value;
  }

  set dy(value) {
    this.velocity.y = value;
  }

  isAlive() {
    return this.ttl > 0;
  }

  _pc() {}
}

export default Updatable;
