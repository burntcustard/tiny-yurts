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

    this.needyness = 200;
    this.type = 'goat';

    goatFarms.push(this);

    setTimeout(() => this.addAnimal({}), 2000);
    setTimeout(() => this.addAnimal({}), 3000);
    setTimeout(() => this.addAnimal({ isBaby: (goatFarms.length - 1) % 2 }), 4000);

    this.appearing = true;
    setTimeout(() => this.appearing = false, 3000);
  }

  upgrade() {
    const parent1 = this.children.at(-1);
    const parent2 = this.children.at(-2);
    parent1.showLove();
    setTimeout(() => parent2.showLove(), 1000);

    setTimeout(() => {
      parent1.hideLove();
      parent2.hideLove();
    }, 8000);

    setTimeout(() => this.addAnimal({ isBaby: true }), 10000);
  }

  addAnimal({ isBaby = false }) {
    super.addAnimal(new Goat({
      parent: this,
      isBaby,
    }));
  }

  update() {
    super.update();
  }
}
