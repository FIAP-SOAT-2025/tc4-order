/* eslint-disable prettier/prettier */
import ItemQuantityAvailableUseCase from '../../../usecases/item/itemQuantityAvailable.usecase';

describe('ItemQuantityAvailableUseCase', () => {
  describe('_isItemQuantityAvailable', () => {
    it('should return true when item quantity is greater than stock quantity', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(10, 5);

      expect(result).toBe(true);
    });

    it('should return true when item quantity equals stock quantity', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(5, 5);

      expect(result).toBe(true);
    });

    it('should return false when item quantity is less than stock quantity', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(3, 5);

      expect(result).toBe(false);
    });

    it('should return false when item quantity is zero', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(0, 5);

      expect(result).toBe(false);
    });

    it('should return true when stock quantity is zero', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(5, 0);

      expect(result).toBe(true);
    });

    it('should return true when both quantities are zero', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(0, 0);

      expect(result).toBe(true);
    });

    it('should handle large quantities', () => {
      const result = ItemQuantityAvailableUseCase._isItemQuantityAvailable(1000, 500);

      expect(result).toBe(true);
    });
  });
});
