// import { Ox } from './ox';
import { Farm } from './farm';
import { Fish } from './fish';
import { colors } from './colors';

export const fishFarms = [];

export class FishFarm extends Farm {
  constructor(properties) {
    super({
      ...properties,
      fenceColor: '#fff',
      width: 2,
      height: 2,
    });

    this.needyness = 1000;
    this.type = 'fish';

    fishFarms.push(this);

    setTimeout(() => this.addAnimal({}), 2000 + (properties.delay ?? 0));
    setTimeout(() => this.addAnimal({}), 2500 + (properties.delay ?? 0));
    setTimeout(() => this.addAnimal({}), 3000 + (properties.delay ?? 0));
    setTimeout(() => this.addAnimal({}), 3500 + (properties.delay ?? 0));
    setTimeout(() => this.addAnimal({}), 4000 + (properties.delay ?? 0));
    // setTimeout(() => this.addAnimal({ isBaby: (oxFarms.length - 1) % 2 }), 4000 + properties.delay ?? 0);

    this.appearing = true;
    setTimeout(() => this.appearing = false, 3000);
  }

  upgrade() {
    // Fish farms cannot upgrade?
    return false;

    // Cannot upgrade if there are 5 or more ox already
    // if (this.children.length >= 5) {
    //   return false;
    // }

    // // 3 parents 2 babies each upgrade
    // for (let i = 0; i < this.children.filter((c) => !c.isBaby).length; i++) {
    //   setTimeout(() => this.children.filter((c) => !c.isBaby)[i].showLove(), i * 1000);
    //   setTimeout(() => this.children.filter((c) => !c.isBaby)[i].hideLove(), 7000);
    //   if (i) setTimeout(() => this.addAnimal({ isBaby: true }), i * 1000 + 7000);
    // }

    // return true;
  }

  addAnimal({ isBaby = false }) {
    super.addAnimal(new Fish({
      parent: this,
      isBaby,
    }));
  }

  update(gameStarted) {
    super.update(gameStarted);
    // So 3 ox = 2 demand per update, 5 ox = 2 demand per update,
    // so upgrading doubles the demand(?)
  }
}
