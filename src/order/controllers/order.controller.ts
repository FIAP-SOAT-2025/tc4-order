/* eslint-disable prettier/prettier */
import { OrderGateway } from '../gateways/order.gateway';
import FindAllOrderUseCase from '../usecases/order/findOrder/findAllOrder.usecase';
import FindOrderByIdUseCase from '../usecases/order/findOrder/findOrder.usecase';
import UpdateStatusOrderUseCase from '../usecases/order/updateOrder/updateStatusOrder.usecase';
import ProcessOrderUseCase from '../usecases/order/createOrder/createOrder.usecase';
import { OrderDto } from '../infraestructure/api/dto/order.dto';
import Order from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import OrderInterface from '../interfaces/order.interface';
import { GetCustomerByCpfInterface } from '../interfaces/get-customer-by-cpf-Interface';
import { CreatePaymentUseCase } from '../usecases/payment/createPayment.usecase';
import { PaymentGatewayInterface } from '../interfaces/gateways-interfaces/payment-gateway.interface';
import OrderRepositoryInterface from '../interfaces/OrderRepository.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentExternallyResponse } from '../interfaces/responses-interfaces/payment-response.interface';
import { ItemGateway } from '../gateways/item.gateway';

export class OrderController {
  constructor() { }

  static async createOrder(
    createOrderDto: OrderDto,
    orderRepository: OrderRepositoryInterface,
    getCustomerByCpf: GetCustomerByCpfInterface,
    itemGateway: ItemGatewayInterface,
    paymentGateway: PaymentGatewayInterface,
  ): Promise<{ order: OrderInterface; payment: PaymentExternallyResponse }> {
    const orderGateway = new OrderGateway(orderRepository);
    const createPaymentUseCase = new CreatePaymentUseCase(paymentGateway);
    
    try {

      const response = await ProcessOrderUseCase.processOrder(
        createOrderDto,
        orderGateway,
        getCustomerByCpf,
        createPaymentUseCase,
        itemGateway,
      );

      console.log("response do controller:", response);
      return response;
    } catch (error) {
      console.log("catch do controller:");
      throw new Error(`Failed to create order  - ${JSON.stringify(error)}`);
    }
  }

   

  static async find(
    id: string,
    orderRepository: OrderRepositoryInterface,
  ): Promise<Order> {
    const orderGateway = new OrderGateway(orderRepository);
    return FindOrderByIdUseCase.findOrder(id, orderGateway);
  }

  static async findAll(
    orderRepository: OrderRepositoryInterface,
  ): Promise<Order[]> {
    const orderGateway = new OrderGateway(orderRepository);
    return FindAllOrderUseCase.findAll(orderGateway);
  }

  static async updateStatus(
    id: string,
    statusDto: OrderStatusEnum,
    orderRepository: OrderRepositoryInterface,
     itemGateway: ItemGatewayInterface
  ): Promise<{ message: string }> {
      const orderGateway = new OrderGateway(orderRepository);
      return UpdateStatusOrderUseCase.updateStatusOrder(id, statusDto, orderGateway,itemGateway);
  }
}
