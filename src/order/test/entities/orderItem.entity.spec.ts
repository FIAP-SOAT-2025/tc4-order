/* eslint-disable prettier/prettier */
import { OrderItem, OrderItemProps } from '../../entities/orderItem.entity';

describe('OrderItem', () => {
  describe('create', () => {
    it('should create an OrderItem with valid props', () => {
      const props: OrderItemProps = {
        itemId: 'item-123',
        orderId: 'order-456',
        quantity: 2,
        price: 50.0,
      };

      const orderItem = OrderItem.create(props);

      expect(orderItem).toBeInstanceOf(OrderItem);
      expect(orderItem.itemId).toBe('item-123');
      expect(orderItem.orderId).toBe('order-456');
      expect(orderItem.quantity).toBe(2);
      expect(orderItem.price).toBe(50.0);
    });

    it('should create an OrderItem without orderId', () => {
      const props: OrderItemProps = {
        itemId: 'item-123',
        quantity: 3,
        price: 25.5,
      };

      const orderItem = OrderItem.create(props);

      expect(orderItem).toBeInstanceOf(OrderItem);
      expect(orderItem.itemId).toBe('item-123');
      expect(orderItem.orderId).toBeUndefined();
      expect(orderItem.quantity).toBe(3);
      expect(orderItem.price).toBe(25.5);
    });
  });

  describe('getters', () => {
    it('should return correct itemId', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-999',
        quantity: 1,
        price: 10.0,
      });

      expect(orderItem.itemId).toBe('item-999');
    });

    it('should return correct orderId', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        orderId: 'order-789',
        quantity: 1,
        price: 10.0,
      });

      expect(orderItem.orderId).toBe('order-789');
    });

    it('should return correct quantity', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 5,
        price: 10.0,
      });

      expect(orderItem.quantity).toBe(5);
    });

    it('should return correct price', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 99.99,
      });

      expect(orderItem.price).toBe(99.99);
    });
  });

  describe('setOrderId', () => {
    it('should set orderId successfully', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      orderItem.setOrderId('order-999');

      expect(orderItem.orderId).toBe('order-999');
    });

    it('should throw error when orderId is empty', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setOrderId('');
      }).toThrow('Order ID cannot be empty');
    });
  });

  describe('setItemId', () => {
    it('should set orderId successfully using setItemId', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      orderItem.setItemId('order-888');

      expect(orderItem.orderId).toBe('order-888');
    });

    it('should throw error when using setItemId with empty value', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setItemId('');
      }).toThrow('Order ID cannot be empty');
    });
  });

  describe('setQuantity', () => {
    it('should set quantity successfully', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      orderItem.setQuantity(10);

      expect(orderItem.quantity).toBe(10);
    });

    it('should throw error when quantity is zero', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setQuantity(0);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when quantity is negative', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setQuantity(-5);
      }).toThrow('Quantity must be greater than zero');
    });
  });

  describe('setPrice', () => {
    it('should set price successfully', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      orderItem.setPrice(99.99);

      expect(orderItem.price).toBe(99.99);
    });

    it('should throw error when price is zero', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setPrice(0);
      }).toThrow('Price must be greater than zero');
    });

    it('should throw error when price is negative', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 1,
        price: 10.0,
      });

      expect(() => {
        orderItem.setPrice(-10);
      }).toThrow('Price must be greater than zero');
    });
  });
});
