import { CartItem, Meal } from 'generated/prisma/client';
import { CartItemsResponseDto } from '../dto/cart-items-response.dto';

export class CartItemsMapper {
  static toDto(raw: CartItem & { meal: Meal }) {
    const dtoEntity = new CartItemsResponseDto();

    dtoEntity.id = raw.id;

    dtoEntity.meal = raw.meal;

    dtoEntity.price = raw.meal.price;

    dtoEntity.quantity = raw.quantity;

    dtoEntity.totalPrice = raw.price * raw.quantity;

    return dtoEntity;
  }
}
