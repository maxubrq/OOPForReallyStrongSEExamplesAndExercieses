export class CartV1 {
  private _items: { name: string; price: number; qty: number }[] = [];
  get items() {
    return this._items;
  }

  setItem(name: string, price: number, qty: number) {
    this._items.push({ name, price, qty });
  }
}

function main() {
  const cart = new CartV1();
  // When the cart item change its data structure all the callers using this approach need to change also
  const total = cart.items.reduce((acc, i) => acc + i.price * i.qty, 0);
}

export class CartV2 {
  #items: { name: string; price: number; qty: number }[] = [];

  calculateTotal() {
    return this.#items.reduce((acc, i) => acc + i.price * i.qty, 0);
  }
}

function mainV2() {
  const cart = new CartV2();
  // When the cart item change its data structure the caller still maintain the same.
  const total = cart.calculateTotal();
}

// Tell Don’t Ask is, at its core, about caller discipline: the caller should not
// reach into an object’s internals and re-implement its business logic.
// If you expose internal collections (like `items`), you’re relying on the caller
// to stay “stable” and not break invariants.
// The safer approach is to never expose raw state at all: instead, provide
// public APIs (e.g. addItem, calculateTotal, listLineViews) so callers interact
// only through intention-revealing methods.
