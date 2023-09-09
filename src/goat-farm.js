import { Goat } from './goat';
import { Farm } from './farm';
import { colors } from './colors';

export const goatFarms = [];

export class GoatFarm extends Farm {
  constructor(properties) {
    super({
      ...properties,
      fenceColor: colors.goat,
    });

    this.needyness = 240;
    this.type = colors.goat;

    goatFarms.push(this);

    setTimeout(() => this.addAnimal({}), 2000);
    setTimeout(() => this.addAnimal({}), 3000);
    setTimeout(() => this.addAnimal({ isBaby: (goatFarms.length - 1) % 2 }), 4000);
    this.numAnimals = 3;
    this.appearing = true;
    setTimeout(() => this.appearing = false, 3000);
  }

  upgrade() {
    this.numAnimals += 1;

    // Cannot upgrade if there are 7 or more goats already
    if (this.numAnimals >= 7) {
      return false;
    }

    // 2 parents and 1 baby each upgrade
    for (let i = 0; i < 2; i++) {
      setTimeout(() => this.children.filter((c) => !c.isBaby)[i].showLove(), i * 1000);
      setTimeout(() => this.children.filter((c) => !c.isBaby)[i].hideLove(), 7000);
      if (i) setTimeout(() => this.addAnimal({ isBaby: true }), i * 1000 + 7000);
    }

    return true;
  }

  addAnimal({ isBaby = false }) {
    super.addAnimal(new Goat({
      parent: this,
      isBaby,
    }));
  }

  update(gameStarted, updateCount) {
    super.update(gameStarted, updateCount);
  }
}
