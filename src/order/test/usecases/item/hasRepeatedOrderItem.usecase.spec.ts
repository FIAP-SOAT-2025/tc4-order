/* eslint-disable prettier/prettier */
import HasRepeatedOrderItemIdsUseCase from '../../../usecases/item/hasRepeatedOrderItem.usecase';
import OrderItemInterface from '../../../interfaces/order-item.interface';

describe('HasRepeatedOrderItemIdsUseCase', () => {
  describe('hasRepeatedOrderItemIds', () => {
    it('should return false when there are no repeated item IDs', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 2 },
        { itemId: 'item-2', itemQuantity: 1 },
        { itemId: 'item-3', itemQuantity: 3 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true when there are repeated item IDs', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 2 },
        { itemId: 'item-2', itemQuantity: 1 },
        { itemId: 'item-1', itemQuantity: 3 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return true when first two items have same ID', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 2 },
        { itemId: 'item-1', itemQuantity: 1 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return false for single item', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 1 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return false for empty array', () => {
      const orderItems: OrderItemInterface[] = [];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should detect duplicates in large array', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 1 },
        { itemId: 'item-2', itemQuantity: 1 },
        { itemId: 'item-3', itemQuantity: 1 },
        { itemId: 'item-4', itemQuantity: 1 },
        { itemId: 'item-5', itemQuantity: 1 },
        { itemId: 'item-3', itemQuantity: 1 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should handle multiple duplicates', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: 'item-1', itemQuantity: 1 },
        { itemId: 'item-1', itemQuantity: 1 },
        { itemId: 'item-2', itemQuantity: 1 },
        { itemId: 'item-2', itemQuantity: 1 },
      ];

      const result = HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });
  });
});
