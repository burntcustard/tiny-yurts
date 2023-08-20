import { Ox } from './ox';
import { Farm } from './farm';

export const oxFarms = [];

export class OxFarm extends Farm {
  constructor(properties) {
    super(properties);

    this.demand = 9900;

    oxFarms.push(this);

    setTimeout(() => this.addAnimal({}), 2000);
    setTimeout(() => this.addAnimal({}), 3000);
    setTimeout(() => this.addAnimal({ isBaby: (oxFarms.length - 1) % 2 }), 4000);

    setTimeout(() => {
      this.upgrade();
    }, 10000);
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
    this.demand += this.children.filter(c => !c.isBaby).length - 1;
    this.numIssues = Math.floor(this.demand / 10000);
  }
}
