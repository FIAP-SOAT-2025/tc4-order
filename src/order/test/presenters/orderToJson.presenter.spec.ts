/* eslint-disable prettier/prettier */
import OrderPresenter from '../../presenters/orderToJson.presenter';
import Order from '../../entities/order.entity';

describe('OrderPresenter', () => {
  describe('formatOrderToJson', () => {
    it('should format order to JSON interface', () => {
      const order = Order.create({
        id: 'order-123',
        customerId: 'customer-456',
        orderItems: [
          { itemId: 'item-1', quantity: 2, price: 50.0 },
        ],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.id).toBe('order-123');
      expect(result.customerId).toBe('customer-456');
      expect(result.totalAmount).toBe(100.0);
      expect(result.orderItems).toHaveLength(1);
    });

    it('should handle order without customerId', () => {
      const order = Order.create({
        id: 'order-789',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 25.0 },
        ],
      });

      const result = OrderPresenter.formatOrderToJson(order);

      expect(result.id).toBe('order-789');
      expect(result.customerId).toBeUndefined();
    });
  });

  describe('formatOrderToDisplay', () => {
    it('should format order to display format with currency', () => {
      const order = Order.create({
        id: 'order-display',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 100.0 },
        ],
      });

      const result = OrderPresenter.formatOrderToDisplay(order);

      expect(result.id).toBe('order-display');
      expect(result.totalAmount).toContain('R$');
      expect(result.orderItems[0].price).toContain('R$');
    });
  });
});
