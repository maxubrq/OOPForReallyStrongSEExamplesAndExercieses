class Address {
  constructor(
    public street: string,
    public city: string
  ) {}
}

class Customer {
  constructor(
    public name: string,
    public address: Address
  ) {}
}

class Order {
  constructor(
    public id: number,
    public customer: Customer
  ) {}
}

function main() {
  // ❌ Vi phạm Law of Demeter

  const order = new Order(1, new Customer('Alice', new Address('123 Main St', 'Hanoi')));
  console.log(order.customer.address.street);
}

class AddressV2 {
  #street: string;
  #city: string;
  constructor(street: string, city: string) {
    this.#street = street;
    this.#city = city;
  }
  format(): string {
    return `${this.#street}, ${this.#city}`;
  }
}

class CustomerV2 {
  #name: string;
  #address: AddressV2;
  constructor(name: string, address: AddressV2) {
    this.#name = name;
    this.#address = address;
  }
  addressString(): string {
    return this.#address.format();
  }
}

class OrderV2 {
  #id: number;
  #customer: CustomerV2;
  constructor(id: number, customer: CustomerV2) {
    this.#id = id;
    this.#customer = customer;
  }

  // Intention-revealing API — caller cannot drill into internals
  getCustomerAddressString(): string {
    return this.#customer.addressString();
  }

  // Optional read projection (copy, not internal refs)
  getSummary(): Readonly<{ id: number; customerAddress: string }> {
    return Object.freeze({ id: this.#id, customerAddress: this.getCustomerAddressString() });
  }
}

function mainV2() {
  const order = new OrderV2(1, new CustomerV2('Alice', new AddressV2('123 Main St', 'Hanoi')));
  console.log(order.getCustomerAddressString());
}

// The Law of Demeter is also about caller discipline: the caller should not
// navigate deep into object graphs (order.customer.address.street).
// If you expose raw internals, you’re forcing the caller to “train-wreck” through
// your structure and coupling them to it.
// The safer approach is to never expose state at all. Instead, surface
// intention-revealing methods (e.g. getCustomerAddressString) or read-only
// projections so callers interact only through your public API.
