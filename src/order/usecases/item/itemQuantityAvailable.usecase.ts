

export default class ItemQuantityAvailableUseCase {
  constructor() {}
  static _isItemQuantityAvailable(itemExternalQuantity: number, estockQuantity: number): boolean {
    console.log("itemExternalQuantity no isItemQuantityAvailable:", itemExternalQuantity);
    console.log("estockQuantity no isItemQuantityAvailable:", estockQuantity);
    if (itemExternalQuantity < estockQuantity) return false;
    return true;
  }
}
