import Order from "../entities/order.entity";
import { OrderStatusEnum } from "../enums/orderStatus.enum";
import OrderGatewayInterface from "../interfaces/gateways-interfaces/oreder-gateways.interface";

export class OrderGateway implements OrderGatewayInterface {
   
  constructor(private readonly orderRepository: OrderGatewayInterface) 
  {}

  create(item: Order): Promise<Order> {
    console.log("Creating order in gateway:", item);
    const order = this.orderRepository.create(item);
    return order;
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const order = await this.orderRepository.findAll();
    return order;
  }

  async updateStatus(id: string, status: OrderStatusEnum): Promise<Order> {
    await this.orderRepository.updateStatus(id, status);
    return this.findById(id);
  }
}
