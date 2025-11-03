

export default class ItemQuantityAvailableUseCase {
  constructor() {}
  static _isItemQuantityAvailable(quantity: number, dtoQuantity: number): boolean {
    console.log("quantity no isItemQuantityAvailable:", quantity);
    console.log("dtoQuantity no isItemQuantityAvailable:", dtoQuantity);
    if (quantity < dtoQuantity) return false;
    return true;
  }
}
