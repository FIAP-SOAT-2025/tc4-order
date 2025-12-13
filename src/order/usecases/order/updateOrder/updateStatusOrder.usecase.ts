import { OrderStatusEnum } from '../../../enums/orderStatus.enum';
import FindOrderUseCase from '../findOrder/findOrder.usecase';
import OrderGatewayInterface from '../../../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';


export default class UpdateStatusOrderUseCase {
  constructor() {}
  static async updateStatusOrder(
    id: string,
    status: OrderStatusEnum,
    orderGateway: OrderGatewayInterface,
    itemGateway: ItemGatewayInterface,
  ): Promise<{ message: string }> {
    const order = await FindOrderUseCase.findOrder(id, orderGateway);
    console.log("ordem encontrada no usecase de updateStatus:", order);
    order.updateOrderStatus(status);

    await orderGateway.updateStatusOrder(id, status);
    if (status === OrderStatusEnum.RECEIVED) {
      for (const item of order.orderItems) {
        console.log("[UpdateStatusOrderUseCase] Atualizando quantidade do item:", item._itemId, item._quantity);
        await itemGateway.updateQuantity(
          item._itemId,
          item._quantity
        );
      }
    }
    return {
      message: `Order with ID ${id} updated successfully`,
    };
  }
}
