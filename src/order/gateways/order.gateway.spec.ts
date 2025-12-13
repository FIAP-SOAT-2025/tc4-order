import { OrderGateway } from './order.gateway';
import OrderRepositoryInterface from '../interfaces/OrderRepository.interface';
import Order from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { v4 as uuidv4 } from 'uuid';

describe('OrderGateway', () => {
  let orderGateway: OrderGateway;
  let orderRepositoryMock: jest.Mocked<OrderRepositoryInterface>;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    orderGateway = new OrderGateway(orderRepositoryMock);
  });

  describe('saveOrder', () => {
    it('should save order successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result).toBe(order);
      expect(result.id).toBe(orderId);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
      expect(orderRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should save order with customer', async () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result.customerId).toBe(customerId);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    });

    it('should save order without customer', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 3, price: 30.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result.customerId).toBeUndefined();
      expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    });

    it('should save order with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 10.0 },
        ],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result.orderItems).toHaveLength(3);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    });

    it('should call repository create method', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      await orderGateway.saveOrder(order);

      expect(orderRepositoryMock.create).toHaveBeenCalledWith(order);
    });

    it('should return order from repository', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 2, price: 40.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result).toEqual(order);
    });

    it('should save order with valid UUID', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      // Validate UUID format
      expect(orderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      orderRepositoryMock.create.mockResolvedValue(order);

      const result = await orderGateway.saveOrder(order);

      expect(result.id).toBe(orderId);
    });

    it('should throw error when repository fails', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      const error = new Error('Database error');
      orderRepositoryMock.create.mockRejectedValue(error);

      await expect(orderGateway.saveOrder(order)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getOrderForId', () => {
    it('should get order by id successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId(orderId);

      expect(result).toBe(order);
      expect(result.id).toBe(orderId);
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
    });

    it('should call findById with correct id parameter', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      await orderGateway.getOrderForId(orderId);

      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    });

    it('should get order with valid UUID', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      // Validate UUID format
      expect(orderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 3, price: 15.0 }],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId(orderId);

      expect(result.id).toBe(orderId);
    });

    it('should return order with customer', async () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId(orderId);

      expect(result.customerId).toBe(customerId);
    });

    it('should return order with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.COMPLETED,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 30.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
        ],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId(orderId);

      expect(result.orderItems).toHaveLength(2);
    });

    it('should throw error when order is not found', async () => {
      const orderId = uuidv4();
      const error = new Error('Order not found');

      orderRepositoryMock.findById.mockRejectedValue(error);

      await expect(orderGateway.getOrderForId(orderId)).rejects.toThrow(
        'Order not found',
      );
    });

    it('should return order from repository', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 75.0 }],
      });

      orderRepositoryMock.findById.mockResolvedValue(order);

      const result = await orderGateway.getOrderForId(orderId);

      expect(result).toEqual(order);
    });
  });

  describe('getAllOrders', () => {
    it('should get all orders successfully', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const orders = [
        Order.create({
          id: orderId1,
          status: OrderStatusEnum.READY,
          orderItems: [{ itemId: itemId1, quantity: 2, price: 25.0 }],
        }),
        Order.create({
          id: orderId2,
          status: OrderStatusEnum.PREPARING,
          orderItems: [{ itemId: itemId2, quantity: 1, price: 50.0 }],
        }),
      ];

      orderRepositoryMock.findAll.mockResolvedValue(orders);

      const result = await orderGateway.getAllOrders();

      expect(result).toBe(orders);
      expect(result).toHaveLength(2);
      expect(orderRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no orders exist', async () => {
      orderRepositoryMock.findAll.mockResolvedValue([]);

      const result = await orderGateway.getAllOrders();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return single order', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const orders = [
        Order.create({
          id: orderId,
          status: OrderStatusEnum.RECEIVED,
          orderItems: [{ itemId: itemId, quantity: 3, price: 20.0 }],
        }),
      ];

      orderRepositoryMock.findAll.mockResolvedValue(orders);

      const result = await orderGateway.getAllOrders();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(orderId);
    });

    it('should return orders with different statuses', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const orderId3 = uuidv4();
      const itemId = uuidv4();

      const orders = [
        Order.create({
          id: orderId1,
          status: OrderStatusEnum.READY,
          orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
        }),
        Order.create({
          id: orderId2,
          status: OrderStatusEnum.PREPARING,
          orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
        }),
        Order.create({
          id: orderId3,
          status: OrderStatusEnum.RECEIVED,
          orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
        }),
      ];

      orderRepositoryMock.findAll.mockResolvedValue(orders);

      const result = await orderGateway.getAllOrders();

      expect(result).toHaveLength(3);
      const statuses = result.map((order) => order.status);
      expect(statuses).toContain(OrderStatusEnum.READY);
      expect(statuses).toContain(OrderStatusEnum.PREPARING);
      expect(statuses).toContain(OrderStatusEnum.RECEIVED);
    });

    it('should call repository findAll method', async () => {
      orderRepositoryMock.findAll.mockResolvedValue([]);

      await orderGateway.getAllOrders();

      expect(orderRepositoryMock.findAll).toHaveBeenCalled();
    });

    it('should return orders from repository', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const orders = [
        Order.create({
          id: orderId,
          status: OrderStatusEnum.COMPLETED,
          orderItems: [{ itemId: itemId, quantity: 2, price: 40.0 }],
        }),
      ];

      orderRepositoryMock.findAll.mockResolvedValue(orders);

      const result = await orderGateway.getAllOrders();

      expect(result).toEqual(orders);
    });

    it('should throw error when repository fails', async () => {
      const error = new Error('Database connection failed');
      orderRepositoryMock.findAll.mockRejectedValue(error);

      await expect(orderGateway.getAllOrders()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('updateStatusOrder', () => {
    it('should update order status successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result.id).toBe(orderId);
      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
      expect(orderRepositoryMock.updateStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.RECEIVED,
      );
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    });

    it('should call updateStatus and getOrderForId', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      await orderGateway.updateStatusOrder(orderId, OrderStatusEnum.PREPARING);

      expect(orderRepositoryMock.updateStatus).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.PREPARING,
      );
      expect(orderRepositoryMock.findById).toHaveBeenCalledWith(orderId);
    });

    it('should update status from PENDING to RECEIVED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 3, price: 30.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should update status to PREPARING', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.PREPARING,
      );

      expect(result.status).toBe(OrderStatusEnum.PREPARING);
    });

    it('should update status to READY', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 2, price: 40.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.READY,
      );

      expect(result.status).toBe(OrderStatusEnum.READY);
    });

    it('should update status to COMPLETED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 75.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.COMPLETED,
      );

      expect(result.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should return updated order from findById', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 5, price: 20.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result).toEqual(updatedOrder);
    });

    it('should update order with valid UUID', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      // Validate UUID format
      expect(orderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      const result = await orderGateway.updateStatusOrder(
        orderId,
        OrderStatusEnum.PREPARING,
      );

      expect(result.id).toBe(orderId);
    });

    it('should throw error when updateStatus fails', async () => {
      const orderId = uuidv4();
      const error = new Error('Failed to update status');

      orderRepositoryMock.updateStatus.mockRejectedValue(error);

      await expect(
        orderGateway.updateStatusOrder(orderId, OrderStatusEnum.RECEIVED),
      ).rejects.toThrow('Failed to update status');
    });

    it('should throw error when findById fails after update', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockRejectedValue(
        new Error('Order not found'),
      );

      await expect(
        orderGateway.updateStatusOrder(orderId, OrderStatusEnum.RECEIVED),
      ).rejects.toThrow('Order not found');
    });

    it('should call methods in correct sequence', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const updatedOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      orderRepositoryMock.updateStatus.mockResolvedValue(updatedOrder);
      orderRepositoryMock.findById.mockResolvedValue(updatedOrder);

      await orderGateway.updateStatusOrder(orderId, OrderStatusEnum.READY);

      const updateStatusCall = orderRepositoryMock.updateStatus.mock.invocationCallOrder[0];
      const findByIdCall = orderRepositoryMock.findById.mock.invocationCallOrder[0];

      expect(updateStatusCall).toBeLessThan(findByIdCall);
    });
  });
});
