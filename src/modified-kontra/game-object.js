import Updatable from './updatable';

/**
 * This is the Kontra.js GameObject, with canvas/context, children and more ripped out
 * https://github.com/straker/kontra/blob/main/src/gameObject.js
 */
class GameObject extends Updatable {
  init({
    width = 0,
    height = 0,
    render = this.draw,
    update = this.advance,
    children = [],
    ...props
  } = {}) {
    this._c = [];

    super.init({
      width,
      height,
      ...props
    });

    // di = done init
    this._di = true;
    this._uw();

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

  draw() {}

  _pc() {
    this._uw();
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

  /**
   * Update world properties
   */
  _uw() {
    // don't update world properties until after the init has finished
    if (!this._di) return;

    let {
      _wx = 0,
      _wy = 0,
    } = this.parent || {};

    // wx = world x, wy = world y
    this._wx = this.x;
    this._wy = this.y;

    // ww = world width, wh = world height
    this._ww = this.width;
    this._wh = this.height;

    this._wx += _wx;
    this._wy += _wy;
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
