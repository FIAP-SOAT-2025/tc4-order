import Order from './order.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { v4 as uuidv4 } from 'uuid';

describe('Order', () => {
  describe('create', () => {
    it('should create order with provided id', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      expect(order.id).toBe(orderId);
      expect(order).toBeInstanceOf(Order);
    });

    it('should generate uuid if id is not provided', () => {
      const itemId = uuidv4();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      expect(order.id).toBeDefined();
      expect(order.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should set default status to PENDING if not provided', () => {
      const itemId = uuidv4();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(order.status).toBe(OrderStatusEnum.PENDING);
    });

    it('should use provided status', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(order.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should set createdAt and updatedAt to current date if not provided', () => {
      const itemId = uuidv4();
      const beforeCreate = new Date();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const afterCreate = new Date();

      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
      expect(order.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(order.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should use provided createdAt and updatedAt', () => {
      const itemId = uuidv4();
      const createdAt = new Date('2025-01-01T10:00:00Z');
      const updatedAt = new Date('2025-01-01T11:00:00Z');

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      expect(order.createdAt).toEqual(createdAt);
      expect(order.updatedAt).toEqual(updatedAt);
    });

    it('should set customerId when provided', () => {
      const itemId = uuidv4();
      const customerId = uuidv4();

      const order = Order.create({
        customerId: customerId,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(order.customerId).toBe(customerId);
    });

    it('should create order without customerId', () => {
      const itemId = uuidv4();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(order.customerId).toBeUndefined();
    });

    it('should create orderItems with correct orderId', () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      expect(order.orderItems).toHaveLength(1);
      expect(order.orderItems[0]._orderId).toBe(orderId);
      expect(order.orderItems[0]._itemId).toBe(itemId);
    });

    it('should create order with multiple items', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const order = Order.create({
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 15.0 },
        ],
      });

      expect(order.orderItems).toHaveLength(3);
      expect(order.orderItems[0]._itemId).toBe(itemId1);
      expect(order.orderItems[1]._itemId).toBe(itemId2);
      expect(order.orderItems[2]._itemId).toBe(itemId3);
    });

    it('should calculate total amount correctly for single item', () => {
      const itemId = uuidv4();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      expect(order.totalAmount).toBe(50.0);
    });

    it('should calculate total amount correctly for multiple items', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const order = Order.create({
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 10.0 },
        ],
      });

      expect(order.totalAmount).toBe(130.0);
    });

    it('should throw error when orderItems is empty array', () => {
      expect(() => {
        Order.create({
          orderItems: [],
        });
      }).toThrow('No order items provided');
    });

    it('should throw error when item has no price', () => {
      const itemId = uuidv4();

      expect(() => {
        Order.create({
          orderItems: [{ itemId: itemId, quantity: 2, price: 0 }],
        });
      }).toThrow('Invalid item price or quantity');
    });

    it('should throw error when item has no quantity', () => {
      const itemId = uuidv4();

      expect(() => {
        Order.create({
          orderItems: [{ itemId: itemId, quantity: 0, price: 25.0 }],
        });
      }).toThrow('Invalid item price or quantity');
    });

    it('should handle decimal prices correctly', () => {
      const itemId = uuidv4();

      const order = Order.create({
        orderItems: [{ itemId: itemId, quantity: 3, price: 19.99 }],
      });

      expect(order.totalAmount).toBe(59.97);
    });

    it('should round total amount correctly', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const order = Order.create({
        orderItems: [
          { itemId: itemId1, quantity: 3, price: 10.33 },
          { itemId: itemId2, quantity: 2, price: 5.55 },
        ],
      });

      expect(order.totalAmount).toBe(42.09);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status from PENDING to RECEIVED', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.RECEIVED);

      expect(order.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should update status from RECEIVED to PREPARING', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.PREPARING);

      expect(order.status).toBe(OrderStatusEnum.PREPARING);
    });

    it('should update status from PREPARING to READY', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.READY);

      expect(order.status).toBe(OrderStatusEnum.READY);
    });

    it('should update status from READY to COMPLETED', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.COMPLETED);

      expect(order.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should update updatedAt when status changes', () => {
      const itemId = uuidv4();
      const initialDate = new Date('2025-01-01T10:00:00Z');

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
        updatedAt: initialDate,
      });

      const beforeUpdate = new Date();
      order.updateOrderStatus(OrderStatusEnum.RECEIVED);
      const afterUpdate = new Date();

      expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(order.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
      expect(order.updatedAt).not.toEqual(initialDate);
    });

    it('should allow updating to CANCELLED from any status', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.CANCELLED);

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
    });

    it('should throw error when trying to change status of completed order', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Cannot change status of a completed or cancelled order');
    });

    it('should throw error when trying to change status of cancelled order', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.CANCELLED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Cannot change status of a completed or cancelled order');
    });

    it('should throw error when trying to set same status', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Order status is already set to this value');
    });

    it('should throw error when skipping status in sequence', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PREPARING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PREPARING);
      }).toThrow('Order status must follow the defined sequence');
    });

    it('should throw error when going backwards in status sequence', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Order status must follow the defined sequence');
    });

    it('should throw error with correct next status message', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.READY);
      }).toThrow('Next status must be RECEIVED');
    });

    it('should follow complete status sequence', () => {
      const itemId = uuidv4();

      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.RECEIVED);
      expect(order.status).toBe(OrderStatusEnum.RECEIVED);

      order.updateOrderStatus(OrderStatusEnum.PREPARING);
      expect(order.status).toBe(OrderStatusEnum.PREPARING);

      order.updateOrderStatus(OrderStatusEnum.READY);
      expect(order.status).toBe(OrderStatusEnum.READY);

      order.updateOrderStatus(OrderStatusEnum.COMPLETED);
      expect(order.status).toBe(OrderStatusEnum.COMPLETED);
    });
  });
});
