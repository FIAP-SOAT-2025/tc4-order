import ProcessOrderUseCase from './createOrder.usecase';
import ProccessOrderItemUseCase from '../processOrder/processOrderItem.usecase';
import Order from '../../../entities/order.entity';
import HasRepeatedOrderItemIdsUseCase from '../../item/hasRepeatedOrderItem.usecase';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import OrderPresenter from '../../../presenters/orderToJson.presenter';
import OrderGatewayInterface from '../../../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';
import { GetCustomerByCpfInterface } from '../../../interfaces/get-customer-by-cpf-Interface';
import { OrderStatusEnum } from '../../../enums/orderStatus.enum';
import { CreatePaymentInterface } from 'src/order/interfaces/createPayment.interface';
import { PaymentGatewayInterface } from 'src/order/interfaces/gateways-interfaces/payment-gateway.interface';
import { v4 as uuidv4 } from 'uuid';

describe('ProcessOrderUseCase', () => {
  let orderGatewayMock: jest.Mocked<OrderGatewayInterface>;
  let itemGatewayMock: jest.Mocked<ItemGatewayInterface>;
  let getCustomerByCpfMock: jest.Mocked<GetCustomerByCpfInterface>;
  let createPaymentUseCaseMock: jest.Mocked<CreatePaymentInterface>;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayInterface>;

  beforeEach(() => {
    orderGatewayMock = {
      getOrderForId: jest.fn(),
      saveOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateStatusOrder: jest.fn(),
    };

    itemGatewayMock = {
      getItem: jest.fn(),
      updateQuantity: jest.fn(),
    };

    paymentGatewayMock = {
        createPaymentGateway: jest.fn(),
    }

    getCustomerByCpfMock = {
      getCustomerByCpf: jest.fn(),
    };

    createPaymentUseCaseMock = {
      createPayment: jest.fn(),
    };

  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('processOrder', () => {
    it('should successfully process an order with customer CPF', async () => {
      const customerId = uuidv4();
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        customerCpf: '12345678900',
        orderItems: [
          { itemId: itemId1, itemQuantity: 2 },
          { itemId: itemId2, itemQuantity: 1 },
        ],
      };

      const customerResponse = {
        id: customerId,
        email: 'customer@test.com',
      };

      const processedOrderItems = [
        { itemId: itemId1, quantity: 2, price: 25.0 },
        { itemId: itemId2, quantity: 1, price: 30.0 },
      ];

      const createdOrder = Order.create({
        id: orderId,
        customerId: customerId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 80.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      getCustomerByCpfMock.getCustomerByCpf.mockResolvedValue(customerResponse);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      const result = await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        order: formattedOrder,
        payment: paymentResponse,
      });
      expect(getCustomerByCpfMock.getCustomerByCpf).toHaveBeenCalledWith('12345678900');
      expect(orderGatewayMock.saveOrder).toHaveBeenCalled();
      expect(createPaymentUseCaseMock.createPayment).toHaveBeenCalledWith(
        'customer@test.com',
        orderId,
        createdOrder.totalAmount,
      );
    });

    it('should successfully process an order without customer CPF', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        orderItems: [{ itemId: itemId, itemQuantity: 1 }],
      };

      const processedOrderItems = [{ itemId: itemId, quantity: 1, price: 50.0 }];

      const createdOrder = Order.create({
        id: orderId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 50.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      const result = await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        order: formattedOrder,
        payment: paymentResponse,
      });
      expect(getCustomerByCpfMock.getCustomerByCpf).not.toHaveBeenCalled();
      expect(createPaymentUseCaseMock.createPayment).toHaveBeenCalledWith(
        `payment.order.id+${orderId}@gmail.com`,
        orderId,
        createdOrder.totalAmount,
      );
    });

    it('should throw error when order items have duplicates', async () => {
      const itemId = uuidv4();

      const orderData = {
        orderItems: [
          { itemId: itemId, itemQuantity: 2 },
          { itemId: itemId, itemQuantity: 1 },
        ],
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(true);

      await expect(
        ProcessOrderUseCase.processOrder(
          orderData,
          orderGatewayMock,
          getCustomerByCpfMock,
          createPaymentUseCaseMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow(BaseException);

      await expect(
        ProcessOrderUseCase.processOrder(
          orderData,
          orderGatewayMock,
          getCustomerByCpfMock,
          createPaymentUseCaseMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow(
        'Failed to create order: Order items must be unique. Found duplicate item IDs in order Items.',
      );
    });

    it('should handle order with empty orderItems array', async () => {
      const customerId = uuidv4();
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        customerCpf: '12345678900',
        orderItems: [{ itemId: itemId, itemQuantity: 1 }],
      };

      const customerResponse = {
        id: customerId,
        email: 'customer@test.com',
      };

      const processedOrderItems = [{ itemId: itemId, quantity: 1, price: 50.0 }];

      const createdOrder = Order.create({
        id: orderId,
        customerId: customerId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 50.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      getCustomerByCpfMock.getCustomerByCpf.mockResolvedValue(customerResponse);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      const result = await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(result).toBeDefined();
      expect(result.order).toEqual(formattedOrder);
      expect(result.payment).toEqual(paymentResponse);
      expect(getCustomerByCpfMock.getCustomerByCpf).toHaveBeenCalledWith('12345678900');
    });

    it('should generate email for payment when customer has no email', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        orderItems: [{ itemId: itemId, itemQuantity: 1 }],
      };

      const processedOrderItems = [{ itemId: itemId, quantity: 1, price: 50.0 }];

      const createdOrder = Order.create({
        id: orderId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 50.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(createPaymentUseCaseMock.createPayment).toHaveBeenCalledWith(
        `payment.order.id+${orderId}@gmail.com`,
        orderId,
        createdOrder.totalAmount,
      );
    });

    it('should process order with multiple items correctly', async () => {
      const customerId = uuidv4();
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        customerCpf: '98765432100',
        orderItems: [
          { itemId: itemId1, itemQuantity: 3 },
          { itemId: itemId2, itemQuantity: 2 },
          { itemId: itemId3, itemQuantity: 1 },
        ],
      };

      const customerResponse = {
        id: customerId,
        email: 'test@example.com',
      };

      const processedOrderItems = [
        { itemId: itemId1, quantity: 3, price: 20.0 },
        { itemId: itemId2, quantity: 2, price: 35.0 },
        { itemId: itemId3, quantity: 1, price: 50.0 },
      ];

      const createdOrder = Order.create({
        id: orderId,
        customerId: customerId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 170.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      getCustomerByCpfMock.getCustomerByCpf.mockResolvedValue(customerResponse);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      const result = await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(result.order.orderItems).toHaveLength(3);
      expect(ProccessOrderItemUseCase.proccessOrderItem).toHaveBeenCalledWith(
        orderData,
        itemGatewayMock,
      );
    });

    it('should call all dependencies in the correct order', async () => {
      const customerId = uuidv4();
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        customerCpf: '11122233344',
        orderItems: [{ itemId: itemId, itemQuantity: 1 }],
      };

      const customerResponse = {
        id: customerId,
        email: 'order@test.com',
      };

      const processedOrderItems = [{ itemId: itemId, quantity: 1, price: 100.0 }];

      const createdOrder = Order.create({
        id: orderId,
        customerId: customerId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 100.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      getCustomerByCpfMock.getCustomerByCpf.mockResolvedValue(customerResponse);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds).toHaveBeenCalled();
      expect(getCustomerByCpfMock.getCustomerByCpf).toHaveBeenCalled();
      expect(ProccessOrderItemUseCase.proccessOrderItem).toHaveBeenCalled();
      expect(orderGatewayMock.saveOrder).toHaveBeenCalled();
      expect(createPaymentUseCaseMock.createPayment).toHaveBeenCalled();
      expect(OrderPresenter.formatOrderToJson).toHaveBeenCalled();
    });
  });

  describe('generateEmailForPaymentClient', () => {
    it('should generate correct email format for payment', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderData = {
        orderItems: [{ itemId: itemId, itemQuantity: 1 }],
      };

      const processedOrderItems = [{ itemId: itemId, quantity: 1, price: 50.0 }];

      const createdOrder = Order.create({
        id: orderId,
        orderItems: processedOrderItems,
        status: OrderStatusEnum.PENDING,
      });

      const paymentResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const formattedOrder = {
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 50.0,
        orderItems: processedOrderItems,
      };

      jest
        .spyOn(HasRepeatedOrderItemIdsUseCase, 'hasRepeatedOrderItemIds')
        .mockReturnValue(false);
      jest
        .spyOn(ProccessOrderItemUseCase, 'proccessOrderItem')
        .mockResolvedValue(processedOrderItems);
      orderGatewayMock.saveOrder.mockResolvedValue(createdOrder);
      createPaymentUseCaseMock.createPayment.mockResolvedValue(paymentResponse);
      jest.spyOn(OrderPresenter, 'formatOrderToJson').mockReturnValue(formattedOrder);

      await ProcessOrderUseCase.processOrder(
        orderData,
        orderGatewayMock,
        getCustomerByCpfMock,
        createPaymentUseCaseMock,
        itemGatewayMock,
      );

      expect(createPaymentUseCaseMock.createPayment).toHaveBeenCalledWith(
        `payment.order.id+${orderId}@gmail.com`,
        expect.any(String),
        expect.any(Number),
      );
    });
  });
});
