import { OrderApi } from './order.api';
import { OrderController } from 'src/order/controllers/order.controller';
import { PrismaOrderRepository } from '../../persistence/order.repository';
import { ItemGatewayInterface } from 'src/order/interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentGatewayInterface } from 'src/order/interfaces/gateways-interfaces/payment-gateway.interface';
import GetCustomerByCpf from 'src/order/usecases/customer/getCustomerByCpf.usecase';
import { OrderDto } from '../dto/order.dto';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import { ExceptionMapper } from 'src/shared/exceptions/exception.mapper';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { v4 as uuidv4 } from 'uuid';

jest.mock('src/order/controllers/order.controller');
jest.mock('src/shared/exceptions/exception.mapper');

describe('OrderApi', () => {
  let orderApi: OrderApi;
  let mockOrderRepository: jest.Mocked<PrismaOrderRepository>;
  let mockItemGateway: jest.Mocked<ItemGatewayInterface>;
  let mockPaymentGateway: jest.Mocked<PaymentGatewayInterface>;
  let mockGetCustomerByCpf: jest.Mocked<GetCustomerByCpf>;

  beforeEach(() => {
    mockOrderRepository = {} as jest.Mocked<PrismaOrderRepository>;
    mockItemGateway = {} as jest.Mocked<ItemGatewayInterface>;
    mockPaymentGateway = {} as jest.Mocked<PaymentGatewayInterface>;
    mockGetCustomerByCpf = {} as jest.Mocked<GetCustomerByCpf>;

    orderApi = new OrderApi(
      mockOrderRepository,
      mockItemGateway,
      mockPaymentGateway,
      mockGetCustomerByCpf,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should call OrderController.createOrder with correct parameters', async () => {
      const orderDto: OrderDto = {
        customerCpf: '12345678900',
        orderItems: [{ itemId: uuidv4(), itemQuantity: 2 }],
      };

      const mockResult = {
        order: { id: uuidv4() },
        payment: { paymentId: '123', status: 'approved' },
      };

      (OrderController.createOrder as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderApi.createOrder(orderDto);

      expect(OrderController.createOrder).toHaveBeenCalledWith(
        orderDto,
        mockOrderRepository,
        mockGetCustomerByCpf,
        mockItemGateway,
        mockPaymentGateway,
      );
      expect(result).toEqual(mockResult);
    });

    it('should return order and payment when successful', async () => {
      const orderDto: OrderDto = {
        customerCpf: '98765432100',
        orderItems: [{ itemId: uuidv4(), itemQuantity: 1 }],
      };

      const expectedResponse = {
        order: { id: uuidv4(), status: OrderStatusEnum.PENDING },
        payment: { paymentId: '456', status: 'pending' },
      };

      (OrderController.createOrder as jest.Mock).mockResolvedValue(
        expectedResponse,
      );

      const result = await orderApi.createOrder(orderDto);

      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when OrderController.createOrder fails', async () => {
      const orderDto: OrderDto = {
        customerCpf: '11111111111',
        orderItems: [{ itemId: uuidv4(), itemQuantity: 1 }],
      };

      const error = new BaseException('Customer not found', 404, 'CUSTOMER_NOT_FOUND');
      (OrderController.createOrder as jest.Mock).mockRejectedValue(error);

      await expect(orderApi.createOrder(orderDto)).rejects.toThrow(error);
    });

    it('should handle multiple order items', async () => {
      const orderDto: OrderDto = {
        customerCpf: '12345678900',
        orderItems: [
          { itemId: uuidv4(), itemQuantity: 2 },
          { itemId: uuidv4(), itemQuantity: 3 },
        ],
      };

      const mockResult = {
        order: { id: uuidv4(), totalAmount: 150.0 },
        payment: { paymentId: '789', status: 'approved' },
      };

      (OrderController.createOrder as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderApi.createOrder(orderDto);

      expect(result).toEqual(mockResult);
      expect(OrderController.createOrder).toHaveBeenCalledWith(
        orderDto,
        mockOrderRepository,
        mockGetCustomerByCpf,
        mockItemGateway,
        mockPaymentGateway,
      );
    });

    it('should handle order without customer CPF', async () => {
      const orderDto: OrderDto = {
        orderItems: [{ itemId: uuidv4(), itemQuantity: 1 }],
      };

      const mockResult = {
        order: { id: uuidv4() },
        payment: { paymentId: '999', status: 'pending' },
      };

      (OrderController.createOrder as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderApi.createOrder(orderDto);

      expect(result).toEqual(mockResult);
    });
  });

  describe('find', () => {
    it('should call OrderController.find with correct parameters', async () => {
      const orderId = uuidv4();
      const mockOrder = { id: orderId } as any;

      (OrderController.find as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderApi.find(orderId);

      expect(OrderController.find).toHaveBeenCalledWith(
        orderId,
        mockOrderRepository,
      );
      expect(result).toEqual(mockOrder);
    });

    it('should return order when found', async () => {
      const orderId = uuidv4();
      const mockOrder = {
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
      } as any;

      (OrderController.find as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderApi.find(orderId);

      expect(result.id).toBe(orderId);
    });

    it('should throw error when order not found', async () => {
      const orderId = uuidv4();
      const error = new BaseException('Order not found', 404, 'ORDER_NOT_FOUND');

      (OrderController.find as jest.Mock).mockRejectedValue(error);

      await expect(orderApi.find(orderId)).rejects.toThrow(error);
    });

    it('should handle invalid order id', async () => {
      const invalidId = 'invalid-uuid';
      const error = new BaseException('Invalid order ID', 400, 'INVALID_ID');

      (OrderController.find as jest.Mock).mockRejectedValue(error);

      await expect(orderApi.find(invalidId)).rejects.toThrow(error);
    });

    it('should return complete order with items', async () => {
      const orderId = uuidv4();
      const mockOrder = {
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        totalAmount: 100.0,
        orderItems: [{ itemId: uuidv4(), quantity: 2, price: 50.0 }],
      } as any;

      (OrderController.find as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderApi.find(orderId);

      expect(result.orderItems).toBeDefined();
      expect(result.orderItems.length).toBeGreaterThan(0);
    });
  });

  describe('findAll', () => {
    it('should call OrderController.findAll with repository', async () => {
      const mockOrders = [{ id: uuidv4() }, { id: uuidv4() }] as any[];

      (OrderController.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderApi.findAll();

      expect(OrderController.findAll).toHaveBeenCalledWith(mockOrderRepository);
      expect(result).toEqual(mockOrders);
    });

    it('should return empty array when no orders exist', async () => {
      (OrderController.findAll as jest.Mock).mockResolvedValue([]);

      const result = await orderApi.findAll();

      expect(result).toEqual([]);
    });

    it('should return multiple orders', async () => {
      const mockOrders = [
        { id: uuidv4(), status: OrderStatusEnum.PENDING },
        { id: uuidv4(), status: OrderStatusEnum.READY },
      ] as any[];

      (OrderController.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderApi.findAll();

      expect(result).toHaveLength(2);
    });

    it('should throw error when repository fails', async () => {
      const error = new BaseException('Database error', 500, 'DB_ERROR');

      (OrderController.findAll as jest.Mock).mockRejectedValue(error);

      await expect(orderApi.findAll()).rejects.toThrow(error);
    });

    it('should return orders with different statuses', async () => {
      const mockOrders = [
        { id: uuidv4(), status: OrderStatusEnum.RECEIVED },
        { id: uuidv4(), status: OrderStatusEnum.PREPARING },
        { id: uuidv4(), status: OrderStatusEnum.READY },
        { id: uuidv4(), status: OrderStatusEnum.COMPLETED },
      ] as any[];

      (OrderController.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderApi.findAll();

      expect(result).toHaveLength(4);
      expect(result.map(o => o.status)).toContain(OrderStatusEnum.RECEIVED);
      expect(result.map(o => o.status)).toContain(OrderStatusEnum.PREPARING);
      expect(result.map(o => o.status)).toContain(OrderStatusEnum.READY);
      expect(result.map(o => o.status)).toContain(OrderStatusEnum.COMPLETED);
    });
  });

  describe('updateStatus', () => {
    it('should call OrderController.updateStatus with correct parameters', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.PREPARING };
      const mockUpdatedOrder = { id: orderId, status: OrderStatusEnum.PREPARING } as any;

      (OrderController.updateStatus as jest.Mock).mockResolvedValue(
        mockUpdatedOrder,
      );

      const result = await orderApi.updateStatus(orderId, statusDto);

      expect(OrderController.updateStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.PREPARING,
        mockOrderRepository,
        mockItemGateway,
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should handle errors and map to HttpException', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.READY };
      const baseException = new BaseException('Order not found', 404, 'NOT_FOUND');

      (OrderController.updateStatus as jest.Mock).mockRejectedValue(baseException);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockImplementation((err) => {
        throw new Error('Mapped exception');
      });

      await expect(orderApi.updateStatus(orderId, statusDto)).rejects.toThrow(
        'Mapped exception',
      );
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(baseException);
    });

    it('should update order status successfully', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.COMPLETED };
      const mockUpdatedOrder = { id: orderId, status: OrderStatusEnum.COMPLETED } as any;

      (OrderController.updateStatus as jest.Mock).mockResolvedValue(
        mockUpdatedOrder,
      );

      const result = await orderApi.updateStatus(orderId, statusDto);

      expect(result).toEqual(mockUpdatedOrder);
      expect(mockUpdatedOrder.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should update status to RECEIVED', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.RECEIVED };
      const mockUpdatedOrder = { id: orderId, status: OrderStatusEnum.RECEIVED } as any;

      (OrderController.updateStatus as jest.Mock).mockResolvedValue(
        mockUpdatedOrder,
      );

      const result = await orderApi.updateStatus(orderId, statusDto);

      expect((result as any).status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should update status to READY', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.READY };
      const mockUpdatedOrder = { id: orderId, status: OrderStatusEnum.READY } as any;

      (OrderController.updateStatus as jest.Mock).mockResolvedValue(
        mockUpdatedOrder,
      );

      const result = await orderApi.updateStatus(orderId, statusDto);

      expect((result as any).status).toBe(OrderStatusEnum.READY);
    });

    it('should update status to CANCELLED', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.CANCELLED };
      const mockUpdatedOrder = { id: orderId, status: OrderStatusEnum.CANCELLED } as any;

      (OrderController.updateStatus as jest.Mock).mockResolvedValue(
        mockUpdatedOrder,
      );

      const result = await orderApi.updateStatus(orderId, statusDto);

      expect((result as any).status).toBe(OrderStatusEnum.CANCELLED);
    });

    it('should call ExceptionMapper when any error occurs', async () => {
      const orderId = uuidv4();
      const statusDto = { status: OrderStatusEnum.PREPARING };
      const error = new BaseException('Invalid status transition', 400, 'INVALID_TRANSITION');

      (OrderController.updateStatus as jest.Mock).mockRejectedValue(error);
      (ExceptionMapper.mapToHttpException as jest.Mock).mockImplementation((err) => {
        throw err;
      });

      await expect(orderApi.updateStatus(orderId, statusDto)).rejects.toThrow(error);
      expect(ExceptionMapper.mapToHttpException).toHaveBeenCalledWith(error);
    });
  });
});
