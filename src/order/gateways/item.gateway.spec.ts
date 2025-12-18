import { Test, TestingModule } from '@nestjs/testing';
import { ItemGateway } from './item.gateway';
import { ItemClientInterface } from '../interfaces/clients-interfaces/item-client.interface';
import { ItemResponse } from '../interfaces/responses-interfaces/item-reponse.interface';
import { v4 as uuidv4 } from 'uuid';

describe('ItemGateway', () => {
  let itemGateway: ItemGateway;
  let itemClientMock: jest.Mocked<ItemClientInterface>;

  beforeEach(async () => {
    itemClientMock = {
      getItemExternally: jest.fn(),
      updateItemQuantityExternally: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemGateway,
        {
          provide: 'ItemClientInterface',
          useValue: itemClientMock,
        },
      ],
    }).compile();

    itemGateway = module.get<ItemGateway>(ItemGateway);
  });

  describe('getItem', () => {
    it('should return item when found by id', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 25.5,
        quantity: 10,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result).toEqual({
        id: itemId,
        price: 25.5,
        quantity: 10,
      });
      expect(itemClientMock.getItemExternally).toHaveBeenCalledWith(itemId);
      expect(itemClientMock.getItemExternally).toHaveBeenCalledTimes(1);
    });

    it('should return null when item is not found', async () => {
      const itemId = uuidv4();

      itemClientMock.getItemExternally.mockResolvedValue(null);

      const result = await itemGateway.getItem(itemId);

      expect(result).toBeNull();
      expect(itemClientMock.getItemExternally).toHaveBeenCalledWith(itemId);
    });

    it('should return item with correct id, price and quantity mapping', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 100.0,
        quantity: 5,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(itemId);
      expect(result?.price).toBe(100.0);
      expect(result?.quantity).toBe(5);
    });

    it('should call getItemExternally with correct itemId parameter', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 50.0,
        quantity: 3,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      await itemGateway.getItem(itemId);

      expect(itemClientMock.getItemExternally).toHaveBeenCalledWith(itemId);
    });

    it('should return item with valid UUID as id', async () => {
      const itemId = uuidv4();

      // Validate UUID format
      expect(itemId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const mockItem: ItemResponse = {
        id: itemId,
        price: 75.0,
        quantity: 2,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.id).toBe(itemId);
    });

    it('should handle items with different prices', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 999.99,
        quantity: 1,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.price).toBe(999.99);
    });

    it('should handle items with different quantities', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 10.0,
        quantity: 100,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.quantity).toBe(100);
    });

    it('should handle items with zero quantity', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 25.0,
        quantity: 0,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.quantity).toBe(0);
    });

    it('should handle items with decimal prices', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 12.75,
        quantity: 5,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.price).toBe(12.75);
    });

    it('should return item with only id, price and quantity properties', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 50.0,
        quantity: 10,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('quantity');
      expect(Object.keys(result!)).toHaveLength(3);
    });

    it('should handle multiple sequential calls', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockItem1: ItemResponse = {
        id: itemId1,
        price: 25.0,
        quantity: 5,
      };

      const mockItem2: ItemResponse = {
        id: itemId2,
        price: 50.0,
        quantity: 10,
      };

      itemClientMock.getItemExternally
        .mockResolvedValueOnce(mockItem1)
        .mockResolvedValueOnce(mockItem2);

      const result1 = await itemGateway.getItem(itemId1);
      const result2 = await itemGateway.getItem(itemId2);

      expect(result1?.id).toBe(itemId1);
      expect(result2?.id).toBe(itemId2);
      expect(itemClientMock.getItemExternally).toHaveBeenCalledTimes(2);
    });

    it('should return item data unchanged from client response', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 30.0,
        quantity: 15,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result).toEqual(mockItem);
    });

    it('should handle client errors', async () => {
      const itemId = uuidv4();
      const error = new Error('Client connection error');

      itemClientMock.getItemExternally.mockRejectedValue(error);

      await expect(itemGateway.getItem(itemId)).rejects.toThrow(
        'Client connection error',
      );
    });

    it('should handle network errors', async () => {
      const itemId = uuidv4();
      const networkError = new Error('Network timeout');

      itemClientMock.getItemExternally.mockRejectedValue(networkError);

      await expect(itemGateway.getItem(itemId)).rejects.toThrow(
        'Network timeout',
      );
    });

    it('should handle items with large quantities', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 5.0,
        quantity: 10000,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.quantity).toBe(10000);
    });

    it('should handle items with very small prices', async () => {
      const itemId = uuidv4();
      const mockItem: ItemResponse = {
        id: itemId,
        price: 0.01,
        quantity: 1000,
      };

      itemClientMock.getItemExternally.mockResolvedValue(mockItem);

      const result = await itemGateway.getItem(itemId);

      expect(result?.price).toBe(0.01);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity successfully', async () => {
      const itemId = uuidv4();
      const quantity = 5;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
      expect(
        itemClientMock.updateItemQuantityExternally,
      ).toHaveBeenCalledTimes(1);
    });

    it('should call updateItemQuantityExternally with correct parameters', async () => {
      const itemId = uuidv4();
      const quantity = 10;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
    });

    it('should update quantity with valid UUID', async () => {
      const itemId = uuidv4();

      // Validate UUID format
      expect(itemId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const quantity = 3;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        quantity,
      );
    });

    it('should update quantity to zero', async () => {
      const itemId = uuidv4();
      const quantity = 0;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        0,
      );
    });

    it('should update quantity to large number', async () => {
      const itemId = uuidv4();
      const quantity = 10000;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        10000,
      );
    });

    it('should handle multiple sequential updates', async () => {
      const itemId = uuidv4();

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, 5);
      await itemGateway.updateQuantity(itemId, 10);
      await itemGateway.updateQuantity(itemId, 15);

      expect(
        itemClientMock.updateItemQuantityExternally,
      ).toHaveBeenCalledTimes(3);
      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenNthCalledWith(
        1,
        itemId,
        5,
      );
      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenNthCalledWith(
        2,
        itemId,
        10,
      );
      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenNthCalledWith(
        3,
        itemId,
        15,
      );
    });

    it('should update quantities for different items', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId1, 5);
      await itemGateway.updateQuantity(itemId2, 10);

      expect(
        itemClientMock.updateItemQuantityExternally,
      ).toHaveBeenCalledTimes(2);
      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenNthCalledWith(
        1,
        itemId1,
        5,
      );
      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenNthCalledWith(
        2,
        itemId2,
        10,
      );
    });

    it('should not return any value', async () => {
      const itemId = uuidv4();
      const quantity = 5;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      const result = await itemGateway.updateQuantity(itemId, quantity);

      expect(result).toBeUndefined();
    });

    it('should throw error when client fails', async () => {
      const itemId = uuidv4();
      const quantity = 5;
      const error = new Error('Update failed');

      itemClientMock.updateItemQuantityExternally.mockRejectedValue(error);

      await expect(itemGateway.updateQuantity(itemId, quantity)).rejects.toThrow(
        'Update failed',
      );
    });

    it('should handle network errors during update', async () => {
      const itemId = uuidv4();
      const quantity = 5;
      const networkError = new Error('Network timeout');

      itemClientMock.updateItemQuantityExternally.mockRejectedValue(
        networkError,
      );

      await expect(itemGateway.updateQuantity(itemId, quantity)).rejects.toThrow(
        'Network timeout',
      );
    });

    it('should handle negative quantities', async () => {
      const itemId = uuidv4();
      const quantity = -5;

      itemClientMock.updateItemQuantityExternally.mockResolvedValue(undefined);

      await itemGateway.updateQuantity(itemId, quantity);

      expect(itemClientMock.updateItemQuantityExternally).toHaveBeenCalledWith(
        itemId,
        -5,
      );
    });
  });
});
