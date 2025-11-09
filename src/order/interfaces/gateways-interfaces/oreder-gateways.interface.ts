import Order from "src/order/entities/order.entity";
import { OrderStatusEnum } from "src/order/enums/orderStatus.enum";


export default interface OrderGatewayInterface {
  saveOrder(item: Order): Promise<Order>;
  getOrderForId(id: string): Promise<Order>;
  getAllOrders(): Promise<Order[]>;
  updateStatusOrder(id: string, status: OrderStatusEnum): Promise<Order>;
}
