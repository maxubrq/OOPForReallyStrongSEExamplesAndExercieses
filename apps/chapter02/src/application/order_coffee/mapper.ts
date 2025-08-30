import { CoffeeOrder, Money, PricingPolicyWithDiscount } from '../../domain/coffee_order';
import { NoDiscount } from '../../domain/coffee_order/policy';
import { CoffeeOrderDTO, MoneyDTO } from './dto';

export const MoneyMapper = {
  toDTO(m: Money): MoneyDTO {
    return { amount: m.toMajor(), currency: m.currency };
  },
  fromDTO(dto: MoneyDTO): Money {
    return Money.fromMajor(dto.amount, dto.currency);
  },
};

export const CoffeeOrderMapper = {
  toDTO(o: CoffeeOrder, at?: Date): CoffeeOrderDTO {
    const s = o.snapshot();
    return {
      id: s.id,
      base: s.drink,
      size: s.size,
      toppings: s.toppings,
      currency: s.currency,
      total: MoneyMapper.toDTO(o.price(at ?? new Date())),
    };
  },

  // Tạo lại order từ DTO (không khuyến khích tổng quát; thường ta nhận request → build domain)
  fromDTO(
    dto: CoffeeOrderDTO,
    pricing: PricingPolicyWithDiscount = new PricingPolicyWithDiscount(
      dto.currency,
      new NoDiscount()
    )
  ): CoffeeOrder {
    const o = new (CoffeeOrder as any)(dto.id, dto.base, dto.size, dto.currency, pricing); // gọi constructor private: demo
    for (const t of dto.toppings) (o as any).addTopping(t);
    return o;
  },
};
