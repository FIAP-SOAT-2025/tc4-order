/* eslint-disable prettier/prettier */
import Order, { OrderProps } from '../../entities/order.entity';
import { OrderStatusEnum } from '../../enums/orderStatus.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('Order', () => {
  describe('create', () => {
    it('should create an order with valid props', () => {
      const props: OrderProps = {
        customerId: 'customer-123',
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 2,
            price: 50.0,
          },
          {
            itemId: 'item-2',
            quantity: 1,
            price: 30.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order).toBeInstanceOf(Order);
      expect(order.customerId).toBe('customer-123');
      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.totalAmount).toBe(130.0);
      expect(order.orderItems).toHaveLength(2);
      expect(order.id).toBeDefined();
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should create an order without customerId', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 25.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order).toBeInstanceOf(Order);
      expect(order.customerId).toBeUndefined();
      expect(order.totalAmount).toBe(25.0);
    });

    it('should generate UUID for id if not provided', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 10.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order.id).toBeDefined();
      expect(typeof order.id).toBe('string');
      expect(order.id.length).toBeGreaterThan(0);
    });

    it('should use provided id if given', () => {
      const props: OrderProps = {
        id: 'custom-id-123',
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 10.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order.id).toBe('custom-id-123');
    });

    it('should set default status to PENDING if not provided', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 10.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order.status).toBe(OrderStatusEnum.PENDING);
    });

    it('should use provided status if given', () => {
      const props: OrderProps = {
        status: OrderStatusEnum.RECEIVED,
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: 10.0,
          },
        ],
      };

      const order = Order.create(props);

      expect(order.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should calculate total amount correctly with multiple items', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 3,
            price: 15.5,
          },
          {
            itemId: 'item-2',
            quantity: 2,
            price: 22.75,
          },
        ],
      };

      const order = Order.create(props);

      expect(order.totalAmount).toBe(92.0);
    });

    it('should throw error when orderItems is empty', () => {
      const props: OrderProps = {
        orderItems: [],
      };

      expect(() => {
        Order.create(props);
      }).toThrow('No order items provided');
    });

    it('should throw error when orderItem has no price', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: 1,
            price: undefined as any,
          },
        ],
      };

      expect(() => {
        Order.create(props);
      }).toThrow('Invalid item price or quantity');
    });

    it('should throw error when orderItem has no quantity', () => {
      const props: OrderProps = {
        orderItems: [
          {
            itemId: 'item-1',
            quantity: undefined as any,
            price: 10.0,
          },
        ],
      };

      expect(() => {
        Order.create(props);
      }).toThrow('Invalid item price or quantity');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status from PENDING to RECEIVED', () => {
      const order = Order.create({
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.RECEIVED);

      expect(order.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should update status from RECEIVED to PREPARING', () => {
      const order = Order.create({
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.PREPARING);

      expect(order.status).toBe(OrderStatusEnum.PREPARING);
    });

    it('should update status from PREPARING to READY', () => {
      const order = Order.create({
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.READY);

      expect(order.status).toBe(OrderStatusEnum.READY);
    });

    it('should update status from READY to COMPLETED', () => {
      const order = Order.create({
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.COMPLETED);

      expect(order.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should allow changing to CANCELLED from any status', () => {
      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      order.updateOrderStatus(OrderStatusEnum.CANCELLED);

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
    });

    it('should throw error when trying to update from COMPLETED', () => {
      const order = Order.create({
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Cannot change status of a completed or cancelled order');
    });

    it('should throw error when trying to update from CANCELLED', () => {
      const order = Order.create({
        status: OrderStatusEnum.CANCELLED,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow(BaseException);
    });

    it('should throw error when status is already set to the same value', () => {
      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      }).toThrow('Order status is already set to this value');
    });

    it('should throw error when trying to skip status in sequence', () => {
      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.PREPARING);
      }).toThrow('Order status must follow the defined sequence');
    });

    it('should throw error when trying to go backwards in status sequence', () => {
      const order = Order.create({
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      expect(() => {
        order.updateOrderStatus(OrderStatusEnum.RECEIVED);
      }).toThrow('Order status must follow the defined sequence');
    });

    it('should update updatedAt when status changes', () => {
      const order = Order.create({
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      const originalUpdatedAt = order.updatedAt;

      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        order.updateOrderStatus(OrderStatusEnum.RECEIVED);
        expect(order.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it('should throw BaseException with correct error code for completed order', () => {
      const order = Order.create({
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      try {
        order.updateOrderStatus(OrderStatusEnum.PENDING);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ORDER_STATUS_FINALIZED');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });

    it('should throw BaseException with correct error code for status sequence violation', () => {
      const order = Order.create({
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      try {
        order.updateOrderStatus(OrderStatusEnum.PREPARING);
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('ORDER_STATUS_SEQUENCE');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });
});
