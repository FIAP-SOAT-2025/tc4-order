import Item from '../entities/item/item.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import ItemQuantityAvailableUseCase from './item/itemQuantityAvailable.usecase';
import OrderItemInterface from '../interfaces/order-item.interface';
import { ItemClientOrderInterface } from '../interfaces/item-client.interface';


export default class ValidItemOrderUseCase {
  constructor(private itemClient: ItemClientOrderInterface) {}
  async validItemOrderUseCase(
    orderItemDto: OrderItemInterface,
  ): Promise<Item> {
    const itemResponse = await this.itemClient.getItem(
      orderItemDto.itemId,
    );
    console.log("item encontrado:", itemResponse);
    if (!itemResponse) {
      throw new BaseException('Not Found Item', 404, 'NOT_FOUND_ITEM');
    }
    const newItem = this.mapItemExternallyToItemEntity(itemResponse);

    const isItemQuantityValid =
      ItemQuantityAvailableUseCase._isItemQuantityAvailable(
        newItem.quantity,
        orderItemDto.itemQuantity || 0,
      );

    if (!isItemQuantityValid) {
      throw new BaseException(
        `Failed to create order: Item with ID ${orderItemDto.itemId} does not have enough quantity. Quantity: ${newItem.quantity}`,
        400,
        'ITEM_NOT_AVAILABLE',
      );
    }

    return newItem;
  }


 private  mapItemExternallyToItemEntity(itemExternally: any): Item {
    return new Item({
      id: itemExternally.id,
      name: itemExternally.name,
      description: itemExternally.description,
      images: itemExternally.images,
      quantity: itemExternally.quantity,
      price: itemExternally.price,
      category: itemExternally.category,
      createdAt: itemExternally.createdAt,
      updatedAt: itemExternally.updatedAt,
      isDeleted: itemExternally.isDeleted,
    });
  }
}  
