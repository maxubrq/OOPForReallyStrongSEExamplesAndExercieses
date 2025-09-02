class OrderLine {
  #name: string;
  #price: number;
  #qty: number;
  constructor(name: string, price: number, qty: number) {
    if (!name) throw new Error('OtherLine name cannot be empty');
    if (price <= 0) throw new Error('Price cannot be negative or equal to 0');
    if (qty <= 0) throw new Error('Qty cannot be negative or equal to 0');

    this.#name = name;
    this.#price = price;
    this.#qty = qty;
  }

  total() {
    return this.#price * this.#qty;
  }

  lineView() {
    return {
      name: this.#name,
      price: this.#price,
      qty: this.#qty,
      total: this.total(),
    };
  }
}

export class Order {
  #lines: OrderLine[] = [];

  addLine(name: string, price: number, qty: number) {
    const newLine = new OrderLine(name, price, qty);
    this.#lines.push(newLine);
  }

  calculateTotal(): number {
    return this.#lines.reduce((acc, line) => acc + line.total(), 0);
  }
}

function main() {
  const order = new Order();
  order.addLine('item_1', 1, 1);
  console.log(order.calculateTotal());
}
