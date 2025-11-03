import { OrderStatusEnum } from '../enums/orderStatus.enum';
import FindOrderUseCase from './findOrder.usecase';
import OrderGatewayInterface from '../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';
//import UpdateQuantityItemUseCase from './item/updateQuantityItem.usecase';

/*export default class UpdateStatusOrderUseCase {
  constructor() {}
  static async updateStatusOrder(
    id: string,
    status: OrderStatusEnum,
    orderGateway: OrderGatewayInterface,
    itemGateway: ItemGatewayInterface,
  ): Promise<{ message: string }> {
    const order = await FindOrderUseCase.findOrder(id, orderGateway);
    order.updateOrderStatus(status);

    await orderGateway.updateStatus(id, status);

    if (status === OrderStatusEnum.RECEIVED) {
      for (const item of order.orderItems) {
        //chamar url do item para atualizar a quantidade
        await UpdateQuantityItemUseCase.updateQuantity(
          item._itemId,
          item._quantity,
          itemGateway,
        );
      }
    }
    return {
      message: `Order with ID ${id} updated successfully`,
    };
  }
}*/
