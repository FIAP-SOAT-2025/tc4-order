import ValidItemOrderUseCase from './validItemOrder.usecase';
import { OrderItemProps } from '../entities/orderItem.entity';
import OrderInterface from '../interfaces/order.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';

export default class ProccessOrderItemUseCase {
  constructor() {}
  static async proccessOrderItem(
    order: OrderInterface,
    itemGateway: ItemGatewayInterface,
  ) {
    const processedOrderItems: OrderItemProps[] = [];
    console.log("Order items to process:", order);
    if (order.orderItems) {
      for (const orderItem of order.orderItems) {
        console.log("Processando item:", orderItem);
        //busca o item na api externa de item e valida se existe e se a quantidade esta disponivel
        const itemValidated = await ValidItemOrderUseCase.validItemOrderUseCase(
          orderItem,
          itemGateway,
        );
        console.log("Item validado retornado:", itemValidated);

        if (!itemValidated || !itemValidated.id || itemValidated.price === undefined) {
          throw new Error(`Item validation failed for item ID: ${orderItem.itemId}`);
        }

        processedOrderItems.push({
          itemId: itemValidated.id,
          quantity: orderItem.itemQuantity || 0,
          price: itemValidated.price,
        });
      }
    }
    console.log("Processed order items ARRAY:", processedOrderItems);
    return processedOrderItems;
  }
}
