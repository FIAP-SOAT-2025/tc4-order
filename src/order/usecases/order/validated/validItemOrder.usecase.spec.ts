import ValidItemOrderUseCase from './validItemOrder.usecase';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';
import { ItemResponse } from '../../../interfaces/responses-interfaces/item-reponse.interface';
import OrderItemInterface from '../../../interfaces/order-item.interface';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import ItemQuantityAvailableUseCase from '../../item/itemQuantityAvailable.usecase';
import { v4 as uuidv4 } from 'uuid';

describe('ValidItemOrderUseCase', () => {
  let mockItemGateway: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    mockItemGateway = {
      getItem: jest.fn(),
      updateQuantity: jest.fn(),
    } as jest.Mocked<ItemGatewayInterface>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validItemOrderUseCase', () => {
    it('should validate and return item when item exists and has sufficient quantity', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 5,
        quantity: 5,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 50.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
      expect(mockItemGateway.getItem).toHaveBeenCalledWith(orderItem.itemId);
      expect(mockItemGateway.getItem).toHaveBeenCalledTimes(1);
    });

    it('should validate successfully when item quantity exactly matches required quantity', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 10,
        quantity: 10,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 25.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should throw NOT_FOUND_ITEM exception when item does not exist', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 5,
        quantity: 5,
      };

      mockItemGateway.getItem.mockResolvedValue(null);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toThrow(BaseException);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toMatchObject({
        message: 'Not Found Item',
        statusCode: 404,
        errorCode: 'NOT_FOUND_ITEM',
      });
    });

    it('should throw ITEM_NOT_AVAILABLE exception when item has insufficient quantity', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 15,
        quantity: 15,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 30.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toThrow(BaseException);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toMatchObject({
        statusCode: 400,
        errorCode: 'ITEM_NOT_AVAILABLE',
      });
    });

    it('should validate successfully with quantity 1', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 1,
        quantity: 1,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 1,
        price: 100.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should handle large quantities successfully', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 1000,
        quantity: 1000,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 5000,
        price: 10.5,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should fail when required quantity is 1 more than available', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 11,
        quantity: 11,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 20.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toThrow(BaseException);
    });

    it('should validate when itemQuantity is undefined and defaults to 0', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: undefined,
        quantity: 5,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 15.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should throw error when item gateway returns null', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 1,
        quantity: 1,
      };

      mockItemGateway.getItem.mockResolvedValue(null);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toThrow('Not Found Item');
    });

    it('should pass validation with very large available quantity', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 50,
        quantity: 50,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 999999,
        price: 5.99,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should return correct item details including price', async () => {
      const itemId = uuidv4();
      const orderItem: OrderItemInterface = {
        itemId: itemId,
        itemQuantity: 3,
        quantity: 3,
      };

      const itemExternal: ItemResponse = {
        id: itemId,
        quantity: 20,
        price: 45.75,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result.id).toBe(itemId);
      expect(result.price).toBe(45.75);
      expect(result.quantity).toBe(20);
    });

    it('should call ItemQuantityAvailableUseCase with correct parameters', async () => {
      const spy = jest.spyOn(
        ItemQuantityAvailableUseCase,
        '_isItemQuantityAvailable',
      );

      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 7,
        quantity: 7,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 15,
        price: 12.5,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(spy).toHaveBeenCalledWith(15, 7);
      spy.mockRestore();
    });

    it('should handle zero quantity in stock as insufficient', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 1,
        quantity: 1,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 0,
        price: 10.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toThrow(BaseException);
    });

    it('should validate with decimal prices', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 2,
        quantity: 2,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 100,
        price: 99.99,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result.price).toBe(99.99);
    });

    it('should throw error with correct error message format including item ID', async () => {
      const itemId = uuidv4();
      const orderItem: OrderItemInterface = {
        itemId: itemId,
        itemQuantity: 100,
        quantity: 100,
      };

      const itemExternal: ItemResponse = {
        id: itemId,
        quantity: 50,
        price: 20.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await expect(
        ValidItemOrderUseCase.validItemOrderUseCase(orderItem, mockItemGateway),
      ).rejects.toMatchObject({
        message: expect.stringContaining(itemId),
      });

      const error = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      ).catch((e) => e);

      expect(error.message).toContain('50');
    });

    it('should successfully validate multiple different item IDs', async () => {
      const items = [
        { itemId: uuidv4(), itemQuantity: 5, quantity: 5 },
        { itemId: uuidv4(), itemQuantity: 10, quantity: 10 },
        { itemId: uuidv4(), itemQuantity: 2, quantity: 2 },
      ];

      for (const orderItem of items) {
        const itemExternal: ItemResponse = {
          id: orderItem.itemId,
          quantity: orderItem.itemQuantity! * 2,
          price: 25.0,
        };

        mockItemGateway.getItem.mockResolvedValue(itemExternal);

        const result = await ValidItemOrderUseCase.validItemOrderUseCase(
          orderItem,
          mockItemGateway,
        );

        expect(result.id).toBe(orderItem.itemId);
      }
    });

    it('should handle gateway returning item with exact boundary quantity', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 100,
        quantity: 100,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 100,
        price: 1.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result).toEqual(itemExternal);
    });

    it('should maintain item gateway method call count', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 3,
        quantity: 3,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 30.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(mockItemGateway.getItem).toHaveBeenCalledTimes(1);
      expect(mockItemGateway.updateQuantity).not.toHaveBeenCalled();
    });

    it('should handle item with very small price', async () => {
      const orderItem: OrderItemInterface = {
        itemId: uuidv4(),
        itemQuantity: 5,
        quantity: 5,
      };

      const itemExternal: ItemResponse = {
        id: orderItem.itemId,
        quantity: 10,
        price: 0.01,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result.price).toBe(0.01);
    });

    it('should validate UUID format for item ID', async () => {
      const validUuid = uuidv4();
      const orderItem: OrderItemInterface = {
        itemId: validUuid,
        itemQuantity: 1,
        quantity: 1,
      };

      const itemExternal: ItemResponse = {
        id: validUuid,
        quantity: 5,
        price: 10.0,
      };

      mockItemGateway.getItem.mockResolvedValue(itemExternal);

      const result = await ValidItemOrderUseCase.validItemOrderUseCase(
        orderItem,
        mockItemGateway,
      );

      expect(result.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });
});
