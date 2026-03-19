export const makeTotalPrice = (
  items: {
    price: number;
    quantity: number;
  }[],
) => {
  return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
};
