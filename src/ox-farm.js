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
