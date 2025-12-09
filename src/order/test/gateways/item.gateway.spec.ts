/* eslint-disable prettier/prettier */
import { ItemGateway } from '../../gateways/item.gateway';
import { ItemClientInterface } from '../../interfaces/clients-interfaces/item-client.interface';
import { ItemResponse } from '../../interfaces/responses-interfaces/item-reponse.interface';

describe('ItemGateway', () => {
  let itemGateway: ItemGateway;
  let itemClient: jest.Mocked<ItemClientInterface>;

  beforeEach(() => {
    itemClient = {
      getItemExternally: jest.fn(),
    } as any;

    itemGateway = new ItemGateway(itemClient);
  });

  describe('getItem', () => {
    it('should return item when found', async () => {
      const mockItemExternal = {
        id: 'item-123',
        price: 50.0,
        quantity: 10,
      };

      itemClient.getItemExternally.mockResolvedValue(mockItemExternal);

      const result = await itemGateway.getItem('item-123');

      expect(result).toEqual({
        id: 'item-123',
        price: 50.0,
        quantity: 10,
      });
      expect(itemClient.getItemExternally).toHaveBeenCalledWith('item-123');
      expect(itemClient.getItemExternally).toHaveBeenCalledTimes(1);
    });

    it('should return null when item not found', async () => {
      itemClient.getItemExternally.mockResolvedValue(null);

      const result = await itemGateway.getItem('non-existent-item');

      expect(result).toBeNull();
      expect(itemClient.getItemExternally).toHaveBeenCalledWith('non-existent-item');
    });

    it('should format item data correctly', async () => {
      const externalItem = {
        id: 'item-456',
        price: 99.99,
        quantity: 5,
      };

      itemClient.getItemExternally.mockResolvedValue(externalItem);

      const result = await itemGateway.getItem('item-456');

      expect(result).toEqual({
        id: 'item-456',
        price: 99.99,
        quantity: 5,
      });
    });

    it('should call client with correct item ID', async () => {
      const itemId = 'specific-item-id';
      itemClient.getItemExternally.mockResolvedValue({
        id: itemId,
        price: 25.0,
        quantity: 3,
      });

      await itemGateway.getItem(itemId);

      expect(itemClient.getItemExternally).toHaveBeenCalledWith(itemId);
    });

    it('should handle items with different prices and quantities', async () => {
      const item1 = { id: 'item-1', price: 10.5, quantity: 100 };
      const item2 = { id: 'item-2', price: 200.0, quantity: 1 };

      itemClient.getItemExternally.mockResolvedValueOnce(item1);
      itemClient.getItemExternally.mockResolvedValueOnce(item2);

      const result1 = await itemGateway.getItem('item-1');
      const result2 = await itemGateway.getItem('item-2');

      expect(result1).toEqual(item1);
      expect(result2).toEqual(item2);
    });
  });
});
