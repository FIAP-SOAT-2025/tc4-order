import { ItemGatewayInterface } from "src/order/interfaces/gateways-interfaces/item-gateway.interface";


export default class ExistingItemUseCase {
  constructor() {}
  static async _getExistingItem(
    itemID: string,
    itemGateway: ItemGatewayInterface,
  ) {
    const item = await itemGateway.getItem(itemID)
    if (!item) return null;
    return item;
  }
}
