export type Currency = 'USD' | 'VND';

// Money dùng minor units: USD cents; VND đồng
export class Money {
  private constructor(
    private readonly minor: number,
    public readonly currency: Currency
  ) {
    if (minor < 0) throw new Error('Negative money');
  }

  static fromMajor(amount: number, currency: Currency): Money {
    const factor = currency === 'USD' ? 100 : 1;
    return new Money(Math.round(amount * factor), currency);
  }

  static fromMinor(minor: number, currency: Currency): Money {
    return new Money(minor, currency);
  }

  toMajor(): number {
    const factor = this.currency === 'USD' ? 100 : 1;
    return this.minor / factor;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error('Currency mismatch');
    return Money.fromMinor(this.minor + other.minor, this.currency);
  }

  multiplyInt(n: number): Money {
    if (!Number.isInteger(n) || n < 0) throw new Error('Invalid multiplier');
    return Money.fromMinor(this.minor * n, this.currency);
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.minor === other.minor;
  }
}

// VO khác
export type Size = 'S' | 'M' | 'L';
export type BaseDrink = 'Espresso' | 'Americano' | 'Latte' | 'Cappuccino' | 'Mocha';
export type Topping = 'ExtraShot' | 'SyrupVanilla' | 'SyrupCaramel' | 'WhippedCream';
