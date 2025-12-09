/* eslint-disable prettier/prettier */
import { OrderGateway } from '../../gateways/order.gateway';
import OrderRepositoryInterface from '../../interfaces/OrderRepository.interface';
import Order from '../../entities/order.entity';
import { OrderStatusEnum } from '../../enums/orderStatus.enum';

describe('OrderGateway', () => {
  let orderGateway: OrderGateway;
  let orderRepository: jest.Mocked<OrderRepositoryInterface>;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    orderGateway = new OrderGateway(orderRepository);
  });

  describe('saveOrder', () => {
    it('should save order successfully', async () => {
      const order = Order.create({
        id: 'order-123',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 10.0 },
        ],
      });

      orderRepository.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result).toEqual(order);
      expect(orderRepository.create).toHaveBeenCalledWith(order);
      expect(orderRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should call repository create method with correct order', async () => {
      const order = Order.create({
        customerId: 'customer-456',
        orderItems: [
          { itemId: 'item-1', quantity: 2, price: 50.0 },
        ],
      });

      orderRepository.create.mockResolvedValue(order);

      await orderGateway.saveOrder(order);

      expect(orderRepository.create).toHaveBeenCalledWith(order);
    });
  });

  describe('getOrderForId', () => {
    it('should return order for given id', async () => {
      const order = Order.create({
        id: 'order-789',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 25.0 },
        ],
      });

      orderRepository.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId('order-789');

      expect(result).toEqual(order);
      expect(orderRepository.findById).toHaveBeenCalledWith('order-789');
      expect(orderRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should call repository findById with correct id', async () => {
      const orderId = 'specific-order-id';
      const order = Order.create({
        id: orderId,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      orderRepository.findById.mockResolvedValue(order);

      await orderGateway.getOrderForId(orderId);

      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const orders = [
        Order.create({
          id: 'order-1',
          orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
        }),
        Order.create({
          id: 'order-2',
          orderItems: [{ itemId: 'item-2', quantity: 2, price: 20.0 }],
        }),
      ];

      orderRepository.findAll.mockResolvedValue(orders);

      const result = await orderGateway.getAllOrders();

      expect(result).toEqual(orders);
      expect(result).toHaveLength(2);
      expect(orderRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no orders exist', async () => {
      orderRepository.findAll.mockResolvedValue([]);

      const result = await orderGateway.getAllOrders();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('updateStatusOrder', () => {
    it('should update order status and return updated order', async () => {
      const orderId = 'order-123';
      const newStatus = OrderStatusEnum.RECEIVED;
      const updatedOrder = Order.create({
        id: orderId,
        status: newStatus,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      orderRepository.updateStatus.mockResolvedValue(undefined as any);
      orderRepository.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(orderId, newStatus);

      expect(result).toEqual(updatedOrder);
      expect(orderRepository.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    });

    it('should call repository updateStatus with correct parameters', async () => {
      const orderId = 'order-456';
      const newStatus = OrderStatusEnum.PREPARING;
      const order = Order.create({
        id: orderId,
        status: newStatus,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      orderRepository.updateStatus.mockResolvedValue(undefined as any);
      orderRepository.findById.mockResolvedValue(order);

      await orderGateway.updateStatusOrder(orderId, newStatus);

      expect(orderRepository.updateStatus).toHaveBeenCalledWith(orderId, newStatus);
    });

    it('should fetch updated order after status update', async () => {
      const orderId = 'order-789';
      const newStatus = OrderStatusEnum.COMPLETED;
      const order = Order.create({
        id: orderId,
        status: newStatus,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      orderRepository.updateStatus.mockResolvedValue(undefined as any);
      orderRepository.findById.mockResolvedValue(order);

      await orderGateway.updateStatusOrder(orderId, newStatus);

      expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    });
  });
});
