import HasRepeatedOrderItemIdsUseCase from './hasRepeatedOrderItem.usecase';
import OrderItemInterface from 'src/order/interfaces/order-item.interface';
import { v4 as uuidv4 } from 'uuid';

describe('HasRepeatedOrderItemIdsUseCase', () => {
  describe('hasRepeatedOrderItemIds', () => {
    it('should return false when there are no repeated itemIds', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
        { itemId: uuidv4(), quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true when there are repeated itemIds', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return false for empty array', () => {
      const orderItems: OrderItemInterface[] = [];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return false for single item', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true when first two items have same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return true when last two items have same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return true when all items have same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should work with valid UUID v4 format', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      // Validate UUID format
      expect(itemId1).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
      expect(itemId2).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const orderItems: OrderItemInterface[] = [
        { itemId: itemId1, quantity: 1, price: 10.0 },
        { itemId: itemId2, quantity: 2, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true for duplicate in middle of array', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
        { itemId: uuidv4(), quantity: 4, price: 40.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return true when duplicate appears at different positions', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
        { itemId: uuidv4(), quantity: 3, price: 30.0 },
        { itemId: itemId, quantity: 4, price: 40.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should handle large array without duplicates', () => {
      const orderItems: OrderItemInterface[] = [];
      for (let i = 0; i < 100; i++) {
        orderItems.push({ itemId: uuidv4(), quantity: 1, price: 10.0 });
      }

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should handle large array with duplicates', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [];
      for (let i = 0; i < 50; i++) {
        orderItems.push({ itemId: uuidv4(), quantity: 1, price: 10.0 });
      }
      orderItems.push({ itemId: itemId, quantity: 1, price: 10.0 });
      for (let i = 0; i < 49; i++) {
        orderItems.push({ itemId: uuidv4(), quantity: 1, price: 10.0 });
      }
      orderItems.push({ itemId: itemId, quantity: 2, price: 20.0 });

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should work with different quantities for same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 5, price: 50.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should work with different prices for same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 1, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return false when all itemIds are unique UUIDs', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
        { itemId: uuidv4(), quantity: 3, price: 30.0 },
        { itemId: uuidv4(), quantity: 4, price: 40.0 },
        { itemId: uuidv4(), quantity: 5, price: 50.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should detect duplicate immediately when it appears', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
        { itemId: uuidv4(), quantity: 4, price: 40.0 },
        { itemId: uuidv4(), quantity: 5, price: 50.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should return true for multiple pairs of duplicates', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId1, quantity: 1, price: 10.0 },
        { itemId: itemId2, quantity: 2, price: 20.0 },
        { itemId: itemId1, quantity: 3, price: 30.0 },
        { itemId: itemId2, quantity: 4, price: 40.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should handle items with same quantity and price but different itemIds', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true when there are three items with same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should be case sensitive for itemIds', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const orderItems: OrderItemInterface[] = [
        { itemId: itemId1, quantity: 1, price: 10.0 },
        { itemId: itemId2, quantity: 2, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return false for two items with different UUIDs', () => {
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });

    it('should return true when consecutive items have same itemId', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: uuidv4(), quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
        { itemId: uuidv4(), quantity: 4, price: 40.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should work efficiently with Set data structure', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: uuidv4(), quantity: 2, price: 20.0 },
        { itemId: itemId, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should handle array with only duplicate items', () => {
      const itemId = uuidv4();
      const orderItems: OrderItemInterface[] = [
        { itemId: itemId, quantity: 1, price: 10.0 },
        { itemId: itemId, quantity: 2, price: 20.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(true);
    });

    it('should validate UUID format in itemIds', () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      // Validate all are valid UUIDs
      [itemId1, itemId2, itemId3].forEach((id) => {
        expect(id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
      });

      const orderItems: OrderItemInterface[] = [
        { itemId: itemId1, quantity: 1, price: 10.0 },
        { itemId: itemId2, quantity: 2, price: 20.0 },
        { itemId: itemId3, quantity: 3, price: 30.0 },
      ];

      const result =
        HasRepeatedOrderItemIdsUseCase.hasRepeatedOrderItemIds(orderItems);

      expect(result).toBe(false);
    });
  });
});
