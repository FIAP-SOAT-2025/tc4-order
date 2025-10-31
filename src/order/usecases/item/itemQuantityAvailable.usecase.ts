import Item from 'src/item/entities/item.entity';

export default class ItemQuantityAvailableUseCase {
  constructor() {}
  static _isItemQuantityAvailable(quantity: number, dtoQuantity: number): boolean {
    if (quantity < dtoQuantity) return false;
    return true;
  }
}
