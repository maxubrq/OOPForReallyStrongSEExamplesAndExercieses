import {
  CoffeeOrder,
  Currency,
  DiscountPolicy,
  HappyHour10Percent,
  PricingPolicyWithDiscount,
} from './domain/coffee_order';

function main() {
  const curr: Currency = 'VND';
  const discount: DiscountPolicy = new HappyHour10Percent(curr, [
    {
      start: '12:00',
      end: '17:00',
    },
  ]);
  const policy = new PricingPolicyWithDiscount(curr, discount);
  const coffeeOrder = CoffeeOrder.createNew('Espresso', 'M', curr, policy);
  const date = new Date();
  date.setHours(12, 0);
  const total = coffeeOrder.price(date);
  console.log(`Total = ${total}`);
}

main();
