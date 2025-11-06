import { BaseException } from 'src/shared/exceptions/exceptions.base';

import Order, { OrderProps } from '../entities/order.entity';
import OrderGatewayInterface from '../interfaces/gateways-interfaces/oreder-gateways.interface';

export default class FindOrderByIdUseCase {
  constructor() {}
  static async findOrder(
    id: string,
    orderGateway: OrderGatewayInterface,
  ): Promise<Order> {
    const order = await orderGateway.findById(id);

    if (!order) {
      throw new BaseException(
        `Order with id ${id} not found`,
        404,
        'ORDER_NOT_FOUND',
      );
    }

    const orderFinal = Order.create(order as unknown as OrderProps);
    
   /* if (!orderFinal.payment && order.payment) {
      orderFinal.addPayment(order.payment);
    } */

    return orderFinal;
  }
}
