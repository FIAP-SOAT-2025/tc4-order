/* eslint-disable prettier/prettier */
import OrderItemPresenter from '../../presenters/orderItemToJson.presenter';

describe('OrderItemPresenter', () => {
  describe('formatOrderItemToJson', () => {
    it('should format order item to JSON with id field', () => {
      const item = {
        id: 'item-123',
        quantity: 2,
        price: 50.0,
      };

      const result = OrderItemPresenter.formatOrderItemToJson(item);

      expect(result).toEqual({
        itemId: 'item-123',
        quantity: 2,
        price: 50.0,
      });
    });

    it('should handle item without id field', () => {
      const item = {
        quantity: 3,
        price: 25.0,
      };

      const result = OrderItemPresenter.formatOrderItemToJson(item);

      expect(result).toEqual({
        itemId: '',
        quantity: 3,
        price: 25.0,
      });
    });

    it('should handle different item properties', () => {
      const item = {
        id: 'item-456',
        quantity: 1,
        price: 99.99,
      };

      const result = OrderItemPresenter.formatOrderItemToJson(item);

      expect(result.itemId).toBe('item-456');
      expect(result.quantity).toBe(1);
      expect(result.price).toBe(99.99);
    });
  });
});
