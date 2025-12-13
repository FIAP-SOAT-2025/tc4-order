import { OrderItem, OrderItemProps } from './orderItem.entity';
import { v4 as uuidv4 } from 'uuid';

describe('OrderItem', () => {
  describe('create', () => {
    it('should create order item with all properties', () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        orderId: orderId,
        quantity: 5,
        price: 25.0,
      });

      expect(orderItem).toBeInstanceOf(OrderItem);
      expect(orderItem._itemId).toBe(itemId);
      expect(orderItem._orderId).toBe(orderId);
      expect(orderItem._quantity).toBe(5);
      expect(orderItem._price).toBe(25.0);
    });

    it('should create order item without orderId', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 3,
        price: 50.0,
      });

      expect(orderItem._itemId).toBe(itemId);
      expect(orderItem._orderId).toBeUndefined();
      expect(orderItem._quantity).toBe(3);
      expect(orderItem._price).toBe(50.0);
    });

    it('should create order item with decimal price', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 2,
        price: 19.99,
      });

      expect(orderItem._price).toBe(19.99);
    });

    it('should create order item with quantity 1', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 100.0,
      });

      expect(orderItem._quantity).toBe(1);
    });

    it('should create order item with large quantity', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1000,
        price: 5.0,
      });

      expect(orderItem._quantity).toBe(1000);
    });
  });

  describe('getters', () => {
    it('should get itemId correctly', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(orderItem.itemId).toBe(itemId);
    });

    it('should get orderId correctly', () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        orderId: orderId,
        quantity: 1,
        price: 25.0,
      });

      expect(orderItem.orderId).toBe(orderId);
    });

    it('should get undefined orderId when not set', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(orderItem.orderId).toBeUndefined();
    });

    it('should get quantity correctly', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 10,
        price: 25.0,
      });

      expect(orderItem.quantity).toBe(10);
    });

    it('should get price correctly', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 99.99,
      });

      expect(orderItem.price).toBe(99.99);
    });
  });

  describe('setOrderId', () => {
    it('should set orderId successfully', () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setOrderId(orderId);

      expect(orderItem._orderId).toBe(orderId);
      expect(orderItem.orderId).toBe(orderId);
    });

    it('should update existing orderId', () => {
      const itemId = uuidv4();
      const oldOrderId = uuidv4();
      const newOrderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        orderId: oldOrderId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setOrderId(newOrderId);

      expect(orderItem._orderId).toBe(newOrderId);
    });

    it('should throw error when orderId is empty string', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setOrderId('');
      }).toThrow('Order ID cannot be empty');
    });

    it('should throw error when orderId is null', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setOrderId(null as any);
      }).toThrow('Order ID cannot be empty');
    });

    it('should throw error when orderId is undefined', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setOrderId(undefined as any);
      }).toThrow('Order ID cannot be empty');
    });
  });

  describe('setItemId (deprecated - should be setOrderId)', () => {
    it('should set orderId successfully via setItemId', () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setItemId(orderId);

      expect(orderItem._orderId).toBe(orderId);
    });

    it('should throw error when setItemId receives empty string', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setItemId('');
      }).toThrow('Order ID cannot be empty');
    });
  });

  describe('setQuantity', () => {
    it('should update quantity successfully', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      orderItem.setQuantity(10);

      expect(orderItem._quantity).toBe(10);
      expect(orderItem.quantity).toBe(10);
    });

    it('should update quantity to 1', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      orderItem.setQuantity(1);

      expect(orderItem._quantity).toBe(1);
    });

    it('should update quantity to large number', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      orderItem.setQuantity(9999);

      expect(orderItem._quantity).toBe(9999);
    });

    it('should throw error when quantity is zero', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      expect(() => {
        orderItem.setQuantity(0);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when quantity is negative', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      expect(() => {
        orderItem.setQuantity(-1);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when quantity is null', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      expect(() => {
        orderItem.setQuantity(null as any);
      }).toThrow('Quantity must be greater than zero');
    });

    it('should throw error when quantity is undefined', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      expect(() => {
        orderItem.setQuantity(undefined as any);
      }).toThrow('Quantity must be greater than zero');
    });
  });

  describe('setPrice', () => {
    it('should update price successfully', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setPrice(50.0);

      expect(orderItem._price).toBe(50.0);
      expect(orderItem.price).toBe(50.0);
    });

    it('should update price with decimal value', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setPrice(19.99);

      expect(orderItem._price).toBe(19.99);
    });

    it('should update price to small value', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 100.0,
      });

      orderItem.setPrice(0.01);

      expect(orderItem._price).toBe(0.01);
    });

    it('should update price to large value', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      orderItem.setPrice(9999.99);

      expect(orderItem._price).toBe(9999.99);
    });

    it('should throw error when price is zero', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setPrice(0);
      }).toThrow('Price must be greater than zero');
    });

    it('should throw error when price is negative', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setPrice(-10.0);
      }).toThrow('Price must be greater than zero');
    });

    it('should throw error when price is null', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setPrice(null as any);
      }).toThrow('Price must be greater than zero');
    });

    it('should throw error when price is undefined', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      expect(() => {
        orderItem.setPrice(undefined as any);
      }).toThrow('Price must be greater than zero');
    });
  });

  describe('complete workflow', () => {
    it('should create and modify order item completely', () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 5,
        price: 25.0,
      });

      expect(orderItem.orderId).toBeUndefined();

      orderItem.setOrderId(orderId);
      expect(orderItem.orderId).toBe(orderId);

      orderItem.setQuantity(10);
      expect(orderItem.quantity).toBe(10);

      orderItem.setPrice(30.0);
      expect(orderItem.price).toBe(30.0);

      expect(orderItem.itemId).toBe(itemId);
    });

    it('should maintain itemId immutability through getters', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 25.0,
      });

      const retrievedItemId = orderItem.itemId;

      expect(retrievedItemId).toBe(itemId);
      expect(orderItem.itemId).toBe(itemId);
    });

    it('should allow multiple updates to same property', () => {
      const itemId = uuidv4();

      const orderItem = OrderItem.create({
        itemId: itemId,
        quantity: 1,
        price: 10.0,
      });

      orderItem.setQuantity(5);
      orderItem.setQuantity(10);
      orderItem.setQuantity(15);

      expect(orderItem.quantity).toBe(15);

      orderItem.setPrice(20.0);
      orderItem.setPrice(30.0);
      orderItem.setPrice(40.0);

      expect(orderItem.price).toBe(40.0);
    });
  });
});
