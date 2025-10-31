/* eslint-disable prettier/prettier */
import ItemGatewayInterface from 'src/item/interfaces/itemGatewayInterface';
import OrderGatewayInterface from '../interfaces/gateways';
import { Customer } from '../entities/customer/customer.entity';
import ProccessOrderItemUseCase from './processOrderItem.usecase';
import Order from '../entities/order.entity';
import HasRepeatedOrderItemIdsUseCase from './item/hasRepeatedOrderItem.usecase';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { CreatePaymentUseCase } from 'src/order/usecases/payment/createPayment.usecase';
import { Payment } from 'src/payments/domain/entities/payment.entity';
import { CallPaymentProviderGatewayInterface } from 'src/payments/interfaces/call-payment-provider-gateway.interface';
import { PaymentGatewayInterface } from 'src/payments/interfaces/payment-gateway.interface';
import OrderInterface from '../interfaces/order.interface';
import OrderPresenter from '../presenters/orderToJson.presenter';
import { GetCustomerByCpfInterface } from '../interfaces/get-customer-by-cpf-Interface';

export default class ProcessOrderUseCase {
  constructor() {}
  static async processOrder(
    orderData: OrderInterface,
    orderGateway: OrderGatewayInterface,
    itemGateway: ItemGatewayInterface,
    paymentGateway: PaymentGatewayInterface,
    paymentProvider: CallPaymentProviderGatewayInterface,
    getCustomerByCpf: GetCustomerByCpfInterface,
    createPaymentUseCase: CreatePaymentUseCase,
  ): Promise<{ order: OrderInterface; payment: Payment }> {
    let customer: Customer | undefined;

    if (orderData.orderItems) {
      if (
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
     //busca itens  
    const processedOrderItems =
      await ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGateway);

    const current_order = new Order({
      customerId: customer?.id,
      orderItems: processedOrderItems,
    });

    const createdOrder = await orderGateway.create(current_order);

    const payment = await createPaymentUseCase.createPayment(
      customer?.email || ProcessOrderUseCase.generateEmailForPaymentClient(createdOrder.id),
      createdOrder.id,
      createdOrder.price,
    );

    return {
      order: OrderPresenter.formatOrderToJson(createdOrder),
      payment,
    };
  }

  private static generateEmailForPaymentClient(orderId: string): string {
    return `payment.order.id+${orderId}@gmail.com`;
  }
}
