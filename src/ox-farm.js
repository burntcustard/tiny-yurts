import { Ox } from './ox';
import { Farm } from './farm';
import { colors } from './colors';

export const oxFarms = [];

export class OxFarm extends Farm {
  constructor(properties) {
    super({
      ...properties,
      fenceColor: colors.ox,
    });

    this.needyness = 225;
    this.type = colors.ox;

    oxFarms.push(this);

    const isBaby = (oxFarms.length - 1) % 2;

    setTimeout(() => this.addAnimal({}), 2000 + properties.delay ?? 0);
    setTimeout(() => this.addAnimal({}), 3000 + properties.delay ?? 0);
    setTimeout(() => this.addAnimal({ isBaby }), 4000 + properties.delay ?? 0);
    this.numAnimals = 3;
    this.appearing = true;
    setTimeout(() => this.appearing = false, 3000);
  }

  upgrade() {
    // Cannot upgrade if there are 5 or more oxen already
    if (this.numAnimals >= 5) {
      return false;
    }

    this.numAnimals += 2;

    // 3 parents 2 babies each upgrade
    for (let i = 0; i < this.children.filter((c) => !c.isBaby).length; i++) {
      setTimeout(() => this.children.filter((c) => !c.isBaby)[i].showLove(), i * 1000);
      setTimeout(() => this.children.filter((c) => !c.isBaby)[i].hideLove(), 7000);
      if (i) setTimeout(() => this.addAnimal({ isBaby: true }), i * 1000 + 7000);
    }

    return true;
  }

  addAnimal({ isBaby = false }) {
    super.addAnimal(new Ox({
      parent: this,
      isBaby,
    }));
  }

  update(gameStarted, updateCount) {
    super.update(gameStarted, updateCount);
    // So 3 ox = 2 demand per update, 5 ox = 2 demand per update,
    // so upgrading doubles the demand(?)
  }
}
