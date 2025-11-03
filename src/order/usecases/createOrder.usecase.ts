/* eslint-disable prettier/prettier */
import ProccessOrderItemUseCase from './processOrderItem.usecase';
import Order from '../entities/order.entity';
import HasRepeatedOrderItemIdsUseCase from './item/hasRepeatedOrderItem.usecase';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { CreatePaymentUseCase } from 'src/order/usecases/payment/createPayment.usecase';
import OrderInterface from '../interfaces/order.interface';
import OrderPresenter from '../presenters/orderToJson.presenter';
import { GetCustomerByCpfInterface } from '../interfaces/get-customer-by-cpf-Interface';
import { CustomerExternallyResponse } from '../interfaces/responses-interfaces/customer-externally-response.interface';
import OrderGatewayInterface from '../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';

export default class ProcessOrderUseCase {
  constructor() {}
  static async processOrder(
    orderData: OrderInterface,
    orderGateway: OrderGatewayInterface,
    getCustomerByCpf: GetCustomerByCpfInterface,
    createPaymentUseCase: CreatePaymentUseCase,
    itemGateway: ItemGatewayInterface,
  ): //Promise<{ order: OrderInterface; payment: PaymentExternallyResponse }> {
  Promise<any> {
    console.log("dentro do processOrderUseCase:", orderData);
    let customer: CustomerExternallyResponse | undefined;

    if (orderData.orderItems) {
      if (
        //classe que faz validaçao de itens repetidos no pedido,sem comunicação com o gateway
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(
          orderData.orderItems,
        )
      ) {
        throw new BaseException(
          'Failed to create order: Order items must be unique. Found duplicate item IDs in order Items.',
          400,
          'HAD_ITEM_REPEATED',
        );
      }
    }

    if (orderData.customerCpf) {
      customer = await getCustomerByCpf.getCustomerByCpf(
        orderData.customerCpf
      );
    }
    console.log("cliente encontrado:", customer);
     //busca itens  
    const processedOrderItems =
      await ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGateway);

      console.log("itens processados:", processedOrderItems);
    const current_order = Order.create({
      customerId: customer?.id,
      orderItems: processedOrderItems,
    });

    const createdOrder = await orderGateway.create(current_order);
    console.log("pedido criado:", createdOrder);
    
    const payment = await createPaymentUseCase.createPayment(
      customer?.email || ProcessOrderUseCase.generateEmailForPaymentClient(createdOrder.id),
      createdOrder.id,
      createdOrder.totalAmount,
    );

    const newResponse = {
      order: OrderPresenter.formatOrderToJson(createdOrder),
      payment,
    };

    return newResponse;
  }

  private static generateEmailForPaymentClient(orderId: string): string {
    return `payment.order.id+${orderId}@gmail.com`;
  }
}
