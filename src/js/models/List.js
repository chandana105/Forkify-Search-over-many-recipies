import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    return item;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    // fidn the idnex of the element whih staisfies the condition where leent id === id to be passedin
    // so we got the index where this item is located so we want
    this.items.splice(index, 1);

    // this ll mutate the original array
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }
}

