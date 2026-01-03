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
  });

 /* describe('getItem', () => {
    it('should return mock item response', () => {
      const itemId = uuidv4();

      const result = orderApi.getItem(itemId);

      expect(result).toBeDefined();
      expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result?.quantity).toBe(100);
      expect(result?.price).toBe(22.90);
    });

    it('should always return same mock item regardless of id', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const result1 = orderApi.getItem(itemId1);
      const result2 = orderApi.getItem(itemId2);

      expect(result1).toEqual(result2);
    });
  });*/

  /*describe('getCustomerByCpfEndpoint', () => {
    it('should return mock customer response', () => {
      const cpf = '12345678900';

      const result = orderApi.getCustomerByCpfEndpoint(cpf);

      expect(result).toBeDefined();
      expect(result?.id).toBe('1f228665-4e55-4f0c-9537-da3ea7980511');
      expect(result?.email).toBe('john.doe@example.com');
    });

    it('should always return same mock customer regardless of cpf', () => {
      const result1 = orderApi.getCustomerByCpfEndpoint('11111111111');
      const result2 = orderApi.getCustomerByCpfEndpoint('99999999999');

      expect(result1).toEqual(result2);
    });
  });*/

  /*describe('createPayment', () => {
    it('should return mock payment response', () => {
      const paymentDto = {
        email: 'test@test.com',
        orderId: uuidv4(),
        totalAmount: 100,
      };

      const result = orderApi.createPayment(paymentDto);

      expect(result).toBeDefined();
      expect(result.paymentId).toBe('123');
      expect(result.status).toBe('approved');
    });

    it('should always return same mock payment response', () => {
      const paymentDto1 = {
        email: 'user1@test.com',
        orderId: uuidv4(),
        totalAmount: 50,
      };

      const paymentDto2 = {
        email: 'user2@test.com',
        orderId: uuidv4(),
        totalAmount: 200,
      };

      const result1 = orderApi.createPayment(paymentDto1);
      const result2 = orderApi.createPayment(paymentDto2);

      expect(result1).toEqual(result2);
    });
  });*/

  /*describe('updateItemQuantity', () => {
    it('should return void', () => {
      const itemId = uuidv4();
      const quantity = 10;

      const result = orderApi.updateItemQuantity(itemId, quantity);

      expect(result).toBeUndefined();
    });

    it('should handle different quantities', () => {
      const itemId = uuidv4();

      expect(orderApi.updateItemQuantity(itemId, 1)).toBeUndefined();
      expect(orderApi.updateItemQuantity(itemId, 100)).toBeUndefined();
      expect(orderApi.updateItemQuantity(itemId, 0)).toBeUndefined();
    });
  });*/
});
