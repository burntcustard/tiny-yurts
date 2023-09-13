import Updatable from './updatable';

/**
 * This is the Kontra.js GameObject, with canvas/context and more ripped out
 * https://github.com/straker/kontra/blob/main/src/gameObject.js
 */
class GameObject extends Updatable {
  init({
    width = 1,
    height = 1,
    render = this.draw,
    update = this.advance,
    children = [],
    ...props
  }) {
    this._c = [];

    super.init({
      width,
      height,
      ...props
    });

    this.addChild(children);

    // rf = render function
    this._rf = render;

    // uf = update function
    this._uf = update;
  }

  /**
   * Update all children
   */
  update(dt) {
    this._uf(dt);
    this.children.map(child => child.update && child.update(dt));
  }

  render() {
    this._rf();

    let children = this.children;
    children.map(child => child.render && child.render());
  }

  _pc() {
    this.children.map(child => child._pc());
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  set x(value) {
    this.position.x = value;

    // pc = property changed
    this._pc();
  }

  set y(value) {
    this.position.y = value;
    this._pc();
  }

  get width() {
    // w = width
    return this._w;
  }

  set width(value) {
    this._w = value;
    this._pc();
  }

  get height() {
    // h = height
    return this._h;
  }

  set height(value) {
    this._h = value;
    this._pc();
  }

  set children(value) {
    this.removeChild(this._c);
    this.addChild(value);
  }

  get children() {
    return this._c;
  }

  addChild(...objects) {
    objects.flat().map(child => {
      this.children.push(child);
      child.parent = this;
      child._pc = child._pc || noop;
      child._pc();
    });
  }

  // We never remove children, so this has been commented out
  // removeChild(...objects) {
  //   objects.flat().map(child => {
  //     if (removeFromArray(this.children, child)) {
  //       child.parent = null;
  //       child._pc();
  //     }
  //   });
  // }
}

export default function factory() {
  return new GameObject(...arguments);
}
export { GameObject as GameObjectClass };
