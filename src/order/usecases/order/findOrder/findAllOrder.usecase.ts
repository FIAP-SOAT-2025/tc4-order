import Order from '../../../entities/order.entity';
import OrderGatewayInterface from '../../../interfaces/gateways-interfaces/oreder-gateways.interface';
export default class FindAllOrderUseCase {
  constructor() {}
  static async findAll(orderGateway: OrderGatewayInterface): Promise<Order[]> {
    const order = await orderGateway.getAllOrders();
    return order;
  }
}
