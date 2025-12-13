import { OrderController } from './order.controller';
import { OrderGateway } from '../gateways/order.gateway';
import FindAllOrderUseCase from '../usecases/order/findOrder/findAllOrder.usecase';
import FindOrderByIdUseCase from '../usecases/order/findOrder/findOrder.usecase';
import UpdateStatusOrderUseCase from '../usecases/order/updateOrder/updateStatusOrder.usecase';
import ProcessOrderUseCase from '../usecases/order/createOrder/createOrder.usecase';
import { CreatePaymentUseCase } from '../usecases/payment/createPayment.usecase';
import Order from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import OrderRepositoryInterface from '../interfaces/OrderRepository.interface';
import { ItemGatewayInterface } from '../interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentGatewayInterface } from '../interfaces/gateways-interfaces/payment-gateway.interface';
import { GetCustomerByCpfInterface } from '../interfaces/get-customer-by-cpf-Interface';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../gateways/order.gateway');
jest.mock('../usecases/payment/createPayment.usecase');

describe('OrderController', () => {
  let orderRepositoryMock: jest.Mocked<OrderRepositoryInterface>;
  let itemGatewayMock: jest.Mocked<ItemGatewayInterface>;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayInterface>;
  let getCustomerByCpfMock: jest.Mocked<GetCustomerByCpfInterface>;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    itemGatewayMock = {
      getItem: jest.fn(),
      updateQuantity: jest.fn(),
    };

    paymentGatewayMock = {
      createPaymentGateway: jest.fn(),
    };

    getCustomerByCpfMock = {
      getCustomerByCpf: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order successfully with customer CPF', async () => {
      const customerId = uuidv4();
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderDto = {
        customerCpf: '12345678900',
        orderItems: [
          { itemId: itemId, itemQuantity: 2 },
        ],
      };

      const mockOrder = {
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 50.0,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      };

      const mockPayment = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const mockResponse = {
        order: mockOrder,
        payment: mockPayment,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      const result = await OrderController.createOrder(
        orderDto,
        orderRepositoryMock,
        getCustomerByCpfMock,
        itemGatewayMock,
        paymentGatewayMock,
      );

      expect(result).toEqual(mockResponse);
      expect(result.order.id).toBe(orderId);
      expect(result.payment.paymentId).toBe(paymentId);
      expect(ProcessOrderUseCase.processOrder).toHaveBeenCalledWith(
        orderDto,
        expect.any(OrderGateway),
        getCustomerByCpfMock,
        expect.any(CreatePaymentUseCase),
        itemGatewayMock,
      );
    });

    it('should create order successfully without customer CPF', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderDto = {
        orderItems: [
          { itemId: itemId, itemQuantity: 1 },
        ],
      };

      const mockOrder = {
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 100.0,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      };

      const mockPayment = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const mockResponse = {
        order: mockOrder,
        payment: mockPayment,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      const result = await OrderController.createOrder(
        orderDto,
        orderRepositoryMock,
        getCustomerByCpfMock,
        itemGatewayMock,
        paymentGatewayMock,
      );

      expect(result).toEqual(mockResponse);
      expect(result.order).toBeDefined();
      expect(result.payment).toBeDefined();
    });

    it('should create order with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();
      const paymentId = uuidv4();

      const orderDto = {
        orderItems: [
          { itemId: itemId1, itemQuantity: 2 },
          { itemId: itemId2, itemQuantity: 1 },
          { itemId: itemId3, itemQuantity: 3 },
        ],
      };

      const mockOrder = {
        id: orderId,
        status: OrderStatusEnum.PENDING,
        totalAmount: 150.0,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 16.67 },
        ],
      };

      const mockPayment = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      const mockResponse = {
        order: mockOrder,
        payment: mockPayment,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      const result = await OrderController.createOrder(
        orderDto,
        orderRepositoryMock,
        getCustomerByCpfMock,
        itemGatewayMock,
        paymentGatewayMock,
      );

      expect(result.order.orderItems).toHaveLength(3);
      expect(ProcessOrderUseCase.processOrder).toHaveBeenCalledTimes(1);
    });

    it('should throw error when ProcessOrderUseCase fails', async () => {
      const itemId = uuidv4();

      const orderDto = {
        orderItems: [
          { itemId: itemId, itemQuantity: 1 },
        ],
      };

      const error = new Error('Item not available');
      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockRejectedValue(error);

      await expect(
        OrderController.createOrder(
          orderDto,
          orderRepositoryMock,
          getCustomerByCpfMock,
          itemGatewayMock,
          paymentGatewayMock,
        ),
      ).rejects.toThrow('Failed to create order');
    });

    it('should instantiate OrderGateway with repository', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderDto = {
        orderItems: [
          { itemId: itemId, itemQuantity: 1 },
        ],
      };

      const mockResponse = {
        order: {
          id: orderId,
          status: OrderStatusEnum.PENDING,
          totalAmount: 50.0,
          orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
        },
        payment: {
          paymentId: paymentId,
          status: 'PENDING',
        },
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      await OrderController.createOrder(
        orderDto,
        orderRepositoryMock,
        getCustomerByCpfMock,
        itemGatewayMock,
        paymentGatewayMock,
      );

      expect(OrderGateway).toHaveBeenCalledWith(orderRepositoryMock);
    });

    it('should instantiate CreatePaymentUseCase with payment gateway', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const paymentId = uuidv4();

      const orderDto = {
        orderItems: [
          { itemId: itemId, itemQuantity: 1 },
        ],
      };

      const mockResponse = {
        order: {
          id: orderId,
          status: OrderStatusEnum.PENDING,
          totalAmount: 50.0,
          orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
        },
        payment: {
          paymentId: paymentId,
          status: 'PENDING',
        },
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      await OrderController.createOrder(
        orderDto,
        orderRepositoryMock,
        getCustomerByCpfMock,
        itemGatewayMock,
        paymentGatewayMock,
      );

      expect(CreatePaymentUseCase).toHaveBeenCalledWith(paymentGatewayMock);
    });
  });

  describe('find', () => {
    it('should find order by id successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      jest.spyOn(FindOrderByIdUseCase, 'findOrder').mockResolvedValue(mockOrder);

      const result = await OrderController.find(orderId, orderRepositoryMock);

      expect(result).toEqual(mockOrder);
      expect(result.id).toBe(orderId);
      expect(FindOrderByIdUseCase.findOrder).toHaveBeenCalledWith(
        orderId,
        expect.any(OrderGateway),
      );
    });

    it('should throw error when order is not found', async () => {
      const orderId = uuidv4();

      const error = new Error('Order not found');
      jest.spyOn(FindOrderByIdUseCase, 'findOrder').mockRejectedValue(error);

      await expect(
        OrderController.find(orderId, orderRepositoryMock),
      ).rejects.toThrow('Order not found');
    });

    it('should instantiate OrderGateway with repository', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      jest.spyOn(FindOrderByIdUseCase, 'findOrder').mockResolvedValue(mockOrder);

      await OrderController.find(orderId, orderRepositoryMock);

      expect(OrderGateway).toHaveBeenCalledWith(orderRepositoryMock);
    });
  });

  describe('findAll', () => {
    it('should find all orders successfully', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockOrders = [
        Order.create({
          id: orderId1,
          status: OrderStatusEnum.PENDING,
          orderItems: [{ itemId: itemId1, quantity: 2, price: 25.0 }],
        }),
        Order.create({
          id: orderId2,
          status: OrderStatusEnum.RECEIVED,
          orderItems: [{ itemId: itemId2, quantity: 1, price: 50.0 }],
        }),
      ];

      jest.spyOn(FindAllOrderUseCase, 'findAll').mockResolvedValue(mockOrders);

      const result = await OrderController.findAll(orderRepositoryMock);

      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(orderId1);
      expect(result[1].id).toBe(orderId2);
      expect(FindAllOrderUseCase.findAll).toHaveBeenCalledWith(expect.any(OrderGateway));
    });

    it('should return empty array when no orders exist', async () => {
      jest.spyOn(FindAllOrderUseCase, 'findAll').mockResolvedValue([]);

      const result = await OrderController.findAll(orderRepositoryMock);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should find single order', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrders = [
        Order.create({
          id: orderId,
          status: OrderStatusEnum.PENDING,
          orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
        }),
      ];

      jest.spyOn(FindAllOrderUseCase, 'findAll').mockResolvedValue(mockOrders);

      const result = await OrderController.findAll(orderRepositoryMock);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(orderId);
    });

    it('should instantiate OrderGateway with repository', async () => {
      jest.spyOn(FindAllOrderUseCase, 'findAll').mockResolvedValue([]);

      await OrderController.findAll(orderRepositoryMock);

      expect(OrderGateway).toHaveBeenCalledWith(orderRepositoryMock);
    });
  });

  describe('updateStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      const result = await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(result).toEqual(mockResponse);
      expect(result.message).toContain(orderId);
      expect(UpdateStatusOrderUseCase.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.RECEIVED,
        expect.any(OrderGateway),
        itemGatewayMock,
      );
    });

    it('should update status from PENDING to RECEIVED', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      const result = await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(result.message).toBe(`Order with ID ${orderId} updated successfully`);
    });

    it('should update status to PREPARING', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.PREPARING,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(UpdateStatusOrderUseCase.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.PREPARING,
        expect.any(OrderGateway),
        itemGatewayMock,
      );
    });

    it('should update status to READY', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.READY,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(UpdateStatusOrderUseCase.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.READY,
        expect.any(OrderGateway),
        itemGatewayMock,
      );
    });

    it('should update status to COMPLETED', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.COMPLETED,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(UpdateStatusOrderUseCase.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.COMPLETED,
        expect.any(OrderGateway),
        itemGatewayMock,
      );
    });

    it('should pass itemGateway to UpdateStatusOrderUseCase', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(UpdateStatusOrderUseCase.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.RECEIVED,
        expect.any(OrderGateway),
        itemGatewayMock,
      );
    });

    it('should throw error when update fails', async () => {
      const orderId = uuidv4();

      const error = new Error('Failed to update status');
      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockRejectedValue(error);

      await expect(
        OrderController.updateStatus(
          orderId,
          OrderStatusEnum.RECEIVED,
          orderRepositoryMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow('Failed to update status');
    });

    it('should instantiate OrderGateway with repository', async () => {
      const orderId = uuidv4();

      const mockResponse = {
        message: `Order with ID ${orderId} updated successfully`,
      };

      jest
        .spyOn(UpdateStatusOrderUseCase, 'updateStatusOrder')
        .mockResolvedValue(mockResponse);

      await OrderController.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderRepositoryMock,
        itemGatewayMock,
      );

      expect(OrderGateway).toHaveBeenCalledWith(orderRepositoryMock);
    });
  });
});
