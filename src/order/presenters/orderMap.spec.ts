import { OrderMapper } from './orderMap';
import Order from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { v4 as uuidv4 } from 'uuid';

describe('OrderMapper', () => {
  describe('mapOrderEntityToOrderProcessResponse', () => {
    it('should map order entity to order response correctly', () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        customerId: customerId,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.id).toBe(orderId);
      expect(result.status).toBe(OrderStatusEnum.PENDING);
      expect(result.totalAmount).toBe(50.0);
      expect(result.customerId).toBe(customerId);
    });

    it('should handle order without customerId', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.id).toBe(orderId);
      expect(result.customerId).toBeNull();
    });

    it('should map order with PREPARING status', () => {
      const itemId = uuidv4();
      const order = Order.create({
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 3, price: 30.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.status).toBe(OrderStatusEnum.PREPARING);
      expect(result.totalAmount).toBe(90.0);
    });

    it('should map order with READY status', () => {
      const itemId = uuidv4();
      const order = Order.create({
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.status).toBe(OrderStatusEnum.READY);
    });

    it('should map order with COMPLETED status', () => {
      const itemId = uuidv4();
      const order = Order.create({
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: itemId, quantity: 2, price: 75.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.status).toBe(OrderStatusEnum.COMPLETED);
      expect(result.totalAmount).toBe(150.0);
    });

    it('should preserve order id in mapping', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        orderItems: [{ itemId: itemId, quantity: 1, price: 10.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.id).toBe(orderId);
      expect(result.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should map order with multiple items correctly calculating total', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const order = Order.create({
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 10.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 15.0 },
        ],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.totalAmount).toBe(115.0); // 20 + 50 + 45
    });

    it('should handle order with decimal prices', () => {
      const itemId = uuidv4();
      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 3, price: 33.33 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.totalAmount).toBe(99.99);
    });

    it('should return null for customerId when undefined', () => {
      const itemId = uuidv4();
      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.customerId).toBeNull();
    });

    it('should map order with customerId as string', () => {
      const customerId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        customerId: customerId,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.customerId).toBe(customerId);
      expect(typeof result.customerId).toBe('string');
    });

    it('should preserve status exactly as in entity', () => {
      const statuses = [
        OrderStatusEnum.PENDING,
        OrderStatusEnum.RECEIVED,
        OrderStatusEnum.PREPARING,
        OrderStatusEnum.READY,
        OrderStatusEnum.COMPLETED,
      ];

      statuses.forEach((status) => {
        const itemId = uuidv4();
        const order = Order.create({
          status: status,
          orderItems: [{ itemId: itemId, quantity: 1, price: 10.0 }],
        });

        const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

        expect(result.status).toBe(status);
      });
    });

    it('should handle large totalAmount values', () => {
      const itemId = uuidv4();
      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1000, price: 999.99 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.totalAmount).toBe(999990.0);
    });

    it('should handle small totalAmount values', () => {
      const itemId = uuidv4();
      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 0.01 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result.totalAmount).toBe(0.01);
    });

    it('should return OrderResponse instance', () => {
      const itemId = uuidv4();
      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      const result = OrderMapper.mapOrderEntityToOrderProcessResponse(order);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('totalAmount');
      expect(result).toHaveProperty('customerId');
    });
  });
});
