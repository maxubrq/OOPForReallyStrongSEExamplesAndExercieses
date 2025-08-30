export class CartV1 {
  // Good in compile-time
  // Can be by passed by
  // (cart as any).items = []
  items: { name: string; price: number; qty: number }[] = [];

  addItem(name: string, price: number, qty: number) {
    this.items.push({ name, price, qty });
  }

  calculateTotal(): number {
    return this.items.reduce<number>((acc, i) => acc + i.price * i.qty, 0);
  }
}

class Cart {
  #items: { name: string; price: number; qty: number }[] = []; // Truely encapsulate in runtime

  addItem(name: string, price: number, qty: number) {
    this.#items.push({ name, price, qty });
  }

  calculateTotal(): number {
    return this.#items.reduce<number>((acc, i) => acc + i.price * i.qty, 0);
  }
}
