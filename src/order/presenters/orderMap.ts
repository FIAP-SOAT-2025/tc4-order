import Order from 'src/order/entities/order.entity';
import {
  CompleteOrderResponse,
  OrderResponse,
} from 'src/order/infraestructure/api/dto/orderResponse.dto';

export class OrderMapper {
  static mapOrderEntityToOrderProcessResponse(order: Order): OrderResponse {
    const response = new OrderResponse();
    response.id = order.id;
    response.status = order.status;
    response.totalAmount = order.totalAmount;
    response.customerId = order.customerId ?? null;
    return response;
  }
}
