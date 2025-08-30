import { NoDiscount, PricingPolicyWithDiscount } from './policy';
import { BaseDrink, Currency, Money, Size, Topping } from './vo';

export class CoffeeOrder {
  #id: string; // runtime private
  #drink: BaseDrink;
  #size: Size;
  #toppings: Topping[] = [];
  #currency: Currency;
  #pricing: PricingPolicyWithDiscount;

  private constructor(
    id: string,
    drink: BaseDrink,
    size: Size,
    currency: Currency,
    pricing: PricingPolicyWithDiscount
  ) {
    this.#id = id;
    this.#drink = drink;
    this.#size = size;
    this.#currency = currency;
    this.#pricing = pricing;
  }

  static createNew(
    drink: BaseDrink,
    size: Size,
    currency: Currency = 'USD',
    pricing = new PricingPolicyWithDiscount(currency, new NoDiscount())
  ) {
    return new CoffeeOrder(cryptoRandomId(), drink, size, currency, pricing);
  }

  addTopping(t: Topping) {
    // Invariant: giới hạn 3 topping, cấm duplicate (ví dụ)
    if (this.#toppings.length >= 3) throw new Error('Max 3 toppings allowed');
    if (this.#toppings.includes(t)) throw new Error('Duplicate topping');
    this.#toppings.push(t);
  }

  price(at: Date): Money {
    return this.#pricing.price(this.#drink, this.#size, this.#toppings, at);
  }

  snapshot(): Readonly<{
    id: string;
    drink: BaseDrink;
    size: Size;
    toppings: Topping[];
    currency: Currency;
  }> {
    return Object.freeze({
      id: this.#id,
      drink: this.#drink,
      size: this.#size,
      toppings: [...this.#toppings],
      currency: this.#currency,
    });
  }
}

// Helper id (demo)
function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2);
}
