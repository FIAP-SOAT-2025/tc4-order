import { BaseException } from 'src/shared/exceptions/exceptions.base';
import ItemQuantityAvailableUseCase from '../../item/itemQuantityAvailable.usecase';
import OrderItemInterface from '../../../interfaces/order-item.interface';
import { ItemResponse } from '../../../interfaces/responses-interfaces/item-reponse.interface';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';



export default class ValidItemOrderUseCase {
  constructor() {}
  static async validItemOrderUseCase(
    orderItemDto: OrderItemInterface,
    itemGateway: ItemGatewayInterface,
  ): Promise<ItemResponse> {
    console.log("itemGateway no validItemOrderUseCase:", itemGateway);
    console.log("orderItemDto no validItemOrderUseCase:", orderItemDto);
    
    const itemExternal = await itemGateway.getItem(
      orderItemDto.itemId,
    );
    console.log("item encontrado:", itemExternal);
    if (!itemExternal) {
      throw new BaseException('Not Found Item', 404, 'NOT_FOUND_ITEM');
    }
    
    const isItemQuantityValid =
      ItemQuantityAvailableUseCase._isItemQuantityAvailable(
        itemExternal.quantity,
        orderItemDto.itemQuantity || 0,
      );

    if (!isItemQuantityValid) {
      throw new BaseException(
        `Failed to create order: Item with ID ${orderItemDto.itemId} 
        does not have enough quantity. Quantity: ${itemExternal.quantity}`,
        400,
        'ITEM_NOT_AVAILABLE',
      );
    }
    console.log("item validado com sucesso:", itemExternal);
    return itemExternal;
  }
}  


