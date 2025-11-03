/* eslint-disable prettier/prettier */
import { OrderGateway } from '../gateways/order.gateway';
import FindAllOrderUseCase from '../usecases/findAllOrder.usecase';
import FindOrderByIdUseCase from '../usecases/findOrder.usecase';
//import UpdateStatusOrderUseCase from '../usecases/updateStatusOrder.usecase';
import ProcessOrderUseCase from '../usecases/createOrder.usecase';
import { OrderDto } from '../infraestructure/api/dto/order.dto';
//import Order from '../entities/order.entity';
//import { OrderStatusEnum } from '../enums/orderStatus.enum';
import OrderInterface from '../interfaces/order.interface';
import { GetCustomerByCpfInterface } from '../interfaces/get-customer-by-cpf-Interface';
import { CreatePaymentUseCase } from '../usecases/payment/createPayment.usecase';
import { PaymentGatewayInterface } from '../interfaces/gateways-interfaces/payment-gateway.interface';
import OrderGatewayInterface from '../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';

export class OrderController {
  constructor() { }

  static async createOrder(
    createOrderDto: OrderDto,
    orderRepository: OrderGatewayInterface,
    getCustomerByCpf: GetCustomerByCpfInterface,
    itemGateway: ItemGatewayInterface,
    paymentGateway: PaymentGatewayInterface,
  ): //Promise<{ order: OrderInterface; payment: Payment }> {
    Promise<any> {
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

 /* static async find(
    id: string,
    orderRepository: OrderGatewayInterface,
      );
      return
    } catch (error) {
      throw new Error(`Failed to create order  - ${JSON.stringify(error)}`);
    }
  }

 /* static async find(
    id: string,
    orderRepository: OrderGatewayInterface,
  ): Promise<Order> {
    const orderGateway = new OrderGateway(orderRepository);
    return FindOrderByIdUseCase.findOrder(id, orderGateway);
  }

  static async findAll(
    orderRepository: OrderGatewayInterface,
  ): Promise<Order[]> {
    const orderGateway = new OrderGateway(orderRepository);
    return FindAllOrderUseCase.findAll(orderGateway);
  }

  static async updateStatus(
    id: string,
    statusDto: OrderStatusEnum,
    orderRepository: OrderGatewayInterface,
    itemRepository: ItemRepositoryInterface,
  ): Promise<{ message: string }> {
      const orderGateway = new OrderGateway(orderRepository);
      const itemGateway = new ItemGateway(itemRepository);
      return UpdateStatusOrderUseCase.updateStatusOrder(id, statusDto, orderGateway, itemGateway);
  }*/
}
