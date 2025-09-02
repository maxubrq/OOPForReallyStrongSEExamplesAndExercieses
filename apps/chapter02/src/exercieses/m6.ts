function isInteger(num: number) {
  return Number.isInteger(num);
}

export class Money {
  #currency: string;
  #minor: number; // integer in smallest unit
  #base: number; // e.g., 100 for cents

  static fromMajor(major: number, currency: string, base: number) {
    if (base <= 0 || !isInteger(base)) {
      throw new Error('MoneyError base must be a positive integer');
    }
    const minor = Math.round(major * base);
    if (!isInteger(minor)) {
      throw new Error('MoneyError computed minor must be integer');
    }
    return new Money(currency, minor, base);
  }

  static zero(currency: string, base: number) {
    return new Money(currency, 0, base);
  }

  constructor(currency: string, minor: number, base: number) {
    if (minor < 0 || !isInteger(minor)) {
      throw new Error('MoneyError minor must be a non-negative integer');
    }
    if (base <= 0 || !isInteger(base)) {
      throw new Error('MoneyError base must be a positive integer');
    }
    this.#currency = currency;
    this.#minor = minor;
    this.#base = base;
  }

  get currency() {
    return this.#currency;
  }
  get minor() {
    return this.#minor;
  }
  get base() {
    return this.#base;
  }

  equals(other: Money): boolean {
    return (
      this.#currency === other.#currency &&
      this.#base === other.#base &&
      this.#minor === other.#minor
    );
  }

  toMajor(): number {
    return this.#minor / this.#base;
  }

  add(other: Money): Money {
    this.#assertCompatible(other, 'add');
    return new Money(this.#currency, this.#minor + other.#minor, this.#base);
  }

  sub(other: Money): Money {
    this.#assertCompatible(other, 'subtract');
    const next = this.#minor - other.#minor;
    if (next < 0) throw new Error('MoneyError insufficient amount for subtraction');
    return new Money(this.#currency, next, this.#base);
  }

  #assertCompatible(other: Money, op: string) {
    if (other.#currency !== this.#currency) {
      throw new Error(`MoneyError cannot ${op} different currencies`);
    }
    if (other.#base !== this.#base) {
      throw new Error(`MoneyError cannot ${op} amounts with different base`);
    }
  }
}

export class BankAccount {
  #balance: Money;

  constructor(opening: Money) {
    this.#balance = opening;
  }

  deposit(amount: Money) {
    this.#ensureSameCurrency(amount, 'deposit');
    this.#balance = this.#balance.add(amount);
  }

  withdraw(amount: Money) {
    this.#ensureSameCurrency(amount, 'withdraw');
    this.#balance = this.#balance.sub(amount);
  }

  balance(): Money {
    return this.#balance;
  }

  #ensureSameCurrency(amount: Money, op: string) {
    if (amount.currency !== this.#balance.currency || amount.base !== this.#balance.base) {
      throw new Error(`BankAccountError cannot ${op} different currency/base`);
    }
  }
}
