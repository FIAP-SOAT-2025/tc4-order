/* eslint-disable prettier/prettier */
import ExistingItemUseCase from '../../../usecases/item/existingItem.usecase';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';

describe('ExistingItemUseCase', () => {
  let itemGateway: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    itemGateway = {
      getItem: jest.fn(),
      findItemsByIds: jest.fn(),
    } as any;
  });

  describe('_getExistingItem', () => {
    it('should return item when it exists', async () => {
      const mockItem = {
        id: 'item-123',
        price: 50.0,
        quantity: 10,
      };

      itemGateway.getItem.mockResolvedValue(mockItem);

      const result = await ExistingItemUseCase._getExistingItem('item-123', itemGateway);

      expect(result).toEqual(mockItem);
      expect(itemGateway.getItem).toHaveBeenCalledWith('item-123');
      expect(itemGateway.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return null when item does not exist', async () => {
      itemGateway.getItem.mockResolvedValue(null);

      const result = await ExistingItemUseCase._getExistingItem('non-existent-id', itemGateway);

      expect(result).toBeNull();
      expect(itemGateway.getItem).toHaveBeenCalledWith('non-existent-id');
    });

    it('should call gateway with correct item ID', async () => {
      const itemId = 'specific-item-id-456';
      itemGateway.getItem.mockResolvedValue({ id: itemId, price: 10, quantity: 5 });

      await ExistingItemUseCase._getExistingItem(itemId, itemGateway);

      expect(itemGateway.getItem).toHaveBeenCalledWith(itemId);
    });
  });
});
