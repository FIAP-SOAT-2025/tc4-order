import OrderPresenter from './orderToJson.presenter';
import Order from '../entities/order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { v4 as uuidv4 } from 'uuid';

describe('OrderPresenter', () => {
  describe('formatOrderToJson', () => {
    it('should format order to JSON interface', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const customerId = '12345678900';

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        customerId: customerId,
        totalAmount: 100.0,
        orderItems: [
          {
            itemId: itemId,
            quantity: 2,
            price: 50.0,
          },
        ],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result).toBeDefined();
      expect(result.id).toBe(orderId);
      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
      expect(result.customerId).toBe(customerId);
      expect(result.totalAmount).toBe(100.0);
    });

    it('should format order with multiple items', () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        totalAmount: 150.0,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 50.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
        ],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.orderItems).toHaveLength(2);
      expect(result.totalAmount).toBe(150.0);
    });

    it('should format order without customerId', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.READY,
        totalAmount: 75.0,
        orderItems: [{ itemId: itemId, quantity: 3, price: 25.0 }],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.id).toBe(orderId);
      expect(result.customerId).toBeUndefined();
    });

    it('should preserve order status in formatted JSON', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.COMPLETED,
        totalAmount: 200.0,
        orderItems: [{ itemId: itemId, quantity: 4, price: 50.0 }],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should format order with decimal amounts', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        totalAmount: 123.45,
        orderItems: [{ itemId: itemId, quantity: 1, price: 123.45 }],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.totalAmount).toBe(123.45);
    });

    it('should format order items with correct structure', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        totalAmount: 50.0,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.orderItems[0]).toHaveProperty('itemId');
      expect(result.orderItems[0]).toHaveProperty('quantity');
      expect(result.orderItems[0]).toHaveProperty('price');
    });
  });

  describe('formatOrderToDisplay', () => {
    it('should format order for display', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const customerId = '12345678900';

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        customerId: customerId,
        totalAmount: 100.0,
        orderItems: [{ itemId: itemId, quantity: 2, price: 50.0 }],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result).toBeDefined();
    });

    it('should format order with READY status for display', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.READY,
        totalAmount: 150.0,
        orderItems: [{ itemId: itemId, quantity: 3, price: 50.0 }],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result).toBeDefined();
    });

    it('should format order with multiple items for display', () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        totalAmount: 200.0,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 75.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
        ],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result).toBeDefined();
    });

    it('should format cancelled order for display', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.CANCELLED,
        totalAmount: 50.0,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result).toBeDefined();
    });

    it('should format completed order for display', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.COMPLETED,
        totalAmount: 300.0,
        orderItems: [{ itemId: itemId, quantity: 6, price: 50.0 }],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result).toBeDefined();
    });
  });

  describe('constructor', () => {
    it('should create OrderPresenter instance', () => {
      const presenter = new OrderPresenter();

      expect(presenter).toBeDefined();
      expect(presenter).toBeInstanceOf(OrderPresenter);
    });
  });
});
