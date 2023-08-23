import { Ox } from './ox';
import { Farm } from './farm';

export const oxFarms = [];

export class OxFarm extends Farm {
  constructor(properties) {
    super(properties);

    this.needyness = 200; // 400 is good, tweaking for testing
    this.demand = 0;
    this.type = 'ox';

    oxFarms.push(this);

    setTimeout(() => this.addAnimal({}), 3000);
    setTimeout(() => this.addAnimal({}), 4000);
    setTimeout(() => this.addAnimal({ isBaby: (oxFarms.length - 1) % 2 }), 5000);

    this.appearing = true;
    setTimeout(() => this.appearing = false, 3000);

    // TODO: Swap this to update-based (farm or level) rather than timeout based
    setTimeout(() => {
      this.upgrade();
    }, 50000);
  }

  upgrade() {
    const parent1 = this.children.at(-1);
    const parent2 = this.children.at(-2);
    const parent3 = this.children.at(-3);
    parent1.showLove();
    setTimeout(() => parent2.showLove(), 1000);
    setTimeout(() => parent3.showLove(), 2000);

    setTimeout(() => {
      parent1.hideLove();
      parent2.hideLove();
      parent3.hideLove();
    }, 7000);

    setTimeout(() => this.addAnimal({ isBaby: true }), 8000);
    setTimeout(() => this.addAnimal({ isBaby: true }), 9000);
  }

  addAnimal({ isBaby = false }) {
    super.addAnimal(new Ox({
      parent: this,
      isBaby,
    }));
  }

  update() {
    super.update();

    // So 3 ox = 2 demand per update, 5 ox = 2 demand per update,
    // so upgrading doubles the demand(?)
  }
}
