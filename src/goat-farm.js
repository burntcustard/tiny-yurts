import { Goat } from './goat';
import { Farm } from './farm';

export const goatFarms = [];

export class GoatFarm extends Farm {
  constructor(properties) {
    super(properties);

    this.demand = 9900;

    this.type = 'goat';
    goatFarms.push(this);

    setTimeout(() => this.addAnimal({}), 3000);
    setTimeout(() => this.addAnimal({}), 4000);
    setTimeout(() => this.addAnimal({ isBaby: (goatFarms.length - 1) % 2 }), 5000);

    setTimeout(() => {
      this.upgrade();
    }, 20000);
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

    // So 3 ox = 2 demand per update, 5 ox = 2 demand per update,
    // so upgrading doubles the demand(?)
    this.demand += this.children.filter(c => !c.isBaby).length - 1;
    this.numIssues = Math.floor(this.demand / 5000);
  }
}
