/* eslint-disable prettier/prettier */
import FindAllOrderUseCase from '../../usecases/findAllOrder.usecase';
import OrderGatewayInterface from '../../interfaces/gateways-interfaces/oreder-gateways.interface';
import Order from '../../entities/order.entity';

describe('FindAllOrderUseCase', () => {
  let orderGateway: jest.Mocked<OrderGatewayInterface>;

  beforeEach(() => {
    orderGateway = {
      getAllOrders: jest.fn(),
      getOrderForId: jest.fn(),
      saveOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
    } as any;
  });

  describe('findAll', () => {
    it('should return all orders from gateway', async () => {
      const mockOrders = [
        Order.create({
          id: 'order-1',
          orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
        }),
        Order.create({
          id: 'order-2',
          orderItems: [{ itemId: 'item-2', quantity: 2, price: 20.0 }],
        }),
      ];

      orderGateway.getAllOrders.mockResolvedValue(mockOrders);

      const result = await FindAllOrderUseCase.findAll(orderGateway);

      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);
      expect(orderGateway.getAllOrders).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no orders exist', async () => {
      orderGateway.getAllOrders.mockResolvedValue([]);

      const result = await FindAllOrderUseCase.findAll(orderGateway);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(orderGateway.getAllOrders).toHaveBeenCalledTimes(1);
    });

    it('should call gateway getAllOrders method', async () => {
      orderGateway.getAllOrders.mockResolvedValue([]);

      await FindAllOrderUseCase.findAll(orderGateway);

      expect(orderGateway.getAllOrders).toHaveBeenCalled();
    });
  });
});
