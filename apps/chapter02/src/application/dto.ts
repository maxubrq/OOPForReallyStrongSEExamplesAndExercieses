import { BaseDrink, Currency, Size, Topping } from '../domain/coffee_order';

export type MoneyDTO = { amount: number; currency: Currency };

export type CoffeeOrderDTO = {
    id: string;
    base: BaseDrink;
    size: Size;
    toppings: Topping[];
    currency: Currency;
    total?: MoneyDTO; // có thể embed khi trả response
};