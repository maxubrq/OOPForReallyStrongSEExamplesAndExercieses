import { BaseDrink, Currency, Money, Size, Topping } from './vo';

const BasePriceUSD: Record<BaseDrink, number> = {
  Espresso: 2.5,
  Americano: 2.8,
  Latte: 3.5,
  Cappuccino: 3.4,
  Mocha: 3.8,
};

const SizeUpchargeUSD: Record<Size, number> = { S: 0, M: 0.5, L: 1.0 };

const ToppingPriceUSD: Record<Topping, number> = {
  ExtraShot: 0.7,
  SyrupVanilla: 0.5,
  SyrupCaramel: 0.5,
  WhippedCream: 0.6,
};

class PricingPolicy {
  constructor(private readonly currency: Currency = 'USD') {}

  baseFor(drink: BaseDrink, size: Size): Money {
    const base = BasePriceUSD[drink] + SizeUpchargeUSD[size];
    return Money.fromMajor(base, this.currency);
  }

  toppingPrice(t: Topping): Money {
    return Money.fromMajor(ToppingPriceUSD[t], this.currency);
  }

  price(drink: BaseDrink, size: Size, toppings: Topping[]): Money {
    let total = this.baseFor(drink, size);
    for (const t of toppings) {
      total = total.add(this.toppingPrice(t));
    }
    return total;
  }
}

type TimeWindow = { start: string; end: string }; // "HH:mm"
function inWindow(now: Date, w: TimeWindow): boolean {
  const [sh, sm] = w.start.split(':').map(Number);
  const [eh, em] = w.end.split(':').map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const s = sh * 60 + sm,
    e = eh * 60 + em;
  return minutes >= s && minutes < e;
}

export interface DiscountPolicy {
  apply(price: Money, now: Date): Money;
}

export class HappyHour10Percent implements DiscountPolicy {
  constructor(
    private readonly currency: Currency,
    private readonly windows: TimeWindow[] = [
      { start: '08:00', end: '09:00' },
      { start: '15:00', end: '16:00' },
    ]
  ) {}
  apply(price: Money, now: Date): Money {
    if (!this.windows.some((w) => inWindow(now, w))) return price;
    // 10% (round về minor units)
    const discountedMinor = Math.round(
      price.toMajor() * 0.9 * (price.currency === 'USD' ? 100 : 1)
    );
    return Money.fromMinor(discountedMinor, price.currency);
  }
}

export class CompositeDiscount implements DiscountPolicy {
  constructor(private readonly policies: DiscountPolicy[]) {}
  apply(price: Money, now: Date): Money {
    return this.policies.reduce((p, policy) => policy.apply(p, now), price);
  }
}

export class NoDiscount implements DiscountPolicy {
  apply(price: Money, now: Date): Money {
    return price;
  }
}

// PricingPolicy mở rộng để áp discount
export class PricingPolicyWithDiscount extends PricingPolicy {
  constructor(
    currency: Currency,
    private readonly discount: DiscountPolicy
  ) {
    super(currency);
  }

  price(drink: BaseDrink, size: Size, toppings: Topping[], at: Date = new Date()): Money {
    const raw = super.price(drink, size, toppings);
    return this.discount.apply(raw, at);
  }
}
