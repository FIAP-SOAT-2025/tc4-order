import Order from "../entities/order.entity";
import { OrderStatusEnum } from "../enums/orderStatus.enum";
import OrderGatewayInterface from "../interfaces/gateways-interfaces/oreder-gateways.interface";
import OrderRepositoryInterface from "../interfaces/OrderRepository.interface";

export class OrderGateway implements OrderGatewayInterface {
   
  constructor(private readonly orderRepository: OrderRepositoryInterface) 
  {}

  saveOrder(item: Order): Promise<Order> {
    console.log("Creating order in gateway:", item);
    const order = this.orderRepository.create(item);
    return order;
  }

  async getOrderForId(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    const order = await this.orderRepository.findAll();
    return order;
  }

  async updateStatusOrder(id: string, status: OrderStatusEnum): Promise<Order> {
    await this.orderRepository.updateStatus(id, status);
    return this.getOrderForId(id);
  }
}
