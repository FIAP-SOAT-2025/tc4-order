/* eslint-disable prettier/prettier */
import FindOrderByIdUseCase from '../../usecases/findOrder.usecase';
import OrderGatewayInterface from '../../interfaces/gateways-interfaces/oreder-gateways.interface';
import Order from '../../entities/order.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('FindOrderByIdUseCase', () => {
  let orderGateway: jest.Mocked<OrderGatewayInterface>;

  beforeEach(() => {
    orderGateway = {
      getOrderForId: jest.fn(),
      getAllOrders: jest.fn(),
      saveOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;
  });

  describe('findOrder', () => {
    it('should return order when it exists', async () => {
      const mockOrderData = {
        id: 'order-123',
        customerId: 'customer-456',
        status: 'PENDING',
        totalAmount: 100.0,
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 2,
            price: 50.0,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      orderGateway.getOrderForId.mockResolvedValue(mockOrderData as any);

      const result = await FindOrderByIdUseCase.findOrder('order-123', orderGateway);

      expect(result).toBeInstanceOf(Order);
      expect(result.id).toBe('order-123');
      expect(orderGateway.getOrderForId).toHaveBeenCalledWith('order-123');
      expect(orderGateway.getOrderForId).toHaveBeenCalledTimes(1);
    });

    it('should throw BaseException when order is not found', async () => {
      orderGateway.getOrderForId.mockResolvedValue(null as any);

      await expect(
        FindOrderByIdUseCase.findOrder('non-existent-id', orderGateway),
      ).rejects.toThrow(BaseException);

      await expect(
        FindOrderByIdUseCase.findOrder('non-existent-id', orderGateway),
      ).rejects.toThrow('Order with id non-existent-id not found');
    });

    it('should throw BaseException with correct error code', async () => {
      orderGateway.getOrderForId.mockResolvedValue(null as any);

      try {
        await FindOrderByIdUseCase.findOrder('order-999', orderGateway);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ORDER_NOT_FOUND');
        expect((error as BaseException).statusCode).toBe(404);
      }
    });

    it('should call gateway with correct order ID', async () => {
      const orderId = 'specific-order-id';
      const mockOrderData = {
        id: orderId,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      };

      orderGateway.getOrderForId.mockResolvedValue(mockOrderData as any);

      await FindOrderByIdUseCase.findOrder(orderId, orderGateway);

      expect(orderGateway.getOrderForId).toHaveBeenCalledWith(orderId);
    });

    it('should create Order entity from gateway data', async () => {
      const mockOrderData = {
        id: 'order-789',
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 25.0,
          },
        ],
      };

      orderGateway.getOrderForId.mockResolvedValue(mockOrderData as any);

      const result = await FindOrderByIdUseCase.findOrder('order-789', orderGateway);

      expect(result).toBeInstanceOf(Order);
      expect(result.id).toBe('order-789');
      expect(result.totalAmount).toBe(25.0);
    });
  });
});
