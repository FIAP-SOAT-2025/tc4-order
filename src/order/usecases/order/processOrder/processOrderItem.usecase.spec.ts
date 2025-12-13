import ProccessOrderItemUseCase from './processOrderItem.usecase';
import ValidItemOrderUseCase from '../validated/validItemOrder.usecase';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';
import OrderInterface from '../../../interfaces/order.interface';
import { v4 as uuidv4 } from 'uuid';

describe('ProccessOrderItemUseCase', () => {
  let itemGatewayMock: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    itemGatewayMock = {
      getItem: jest.fn(),
      updateQuantity: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('proccessOrderItem', () => {
    it('should process a single order item successfully', async () => {
      const itemId = uuidv4();
      const orderId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      const validatedItem = {
        id: itemId,
        name: 'Test Item',
        price: 25.0,
        quantity: 10,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(validatedItem);

      const result = await ProccessOrderItemUseCase.proccessOrderItem(
        orderData,
        itemGatewayMock,
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        itemId: itemId,
        quantity: 2,
        price: 25.0,
      });
      expect(ValidItemOrderUseCase.validItemOrderUseCase).toHaveBeenCalledWith(
        orderData.orderItems[0],
        itemGatewayMock,
      );
    });

    it('should process multiple order items successfully', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          { itemId: itemId1, itemQuantity: 2 },
          { itemId: itemId2, itemQuantity: 1 },
          { itemId: itemId3, itemQuantity: 3 },
        ],
      };

      const validatedItem1 = {
        id: itemId1,
        name: 'Item 1',
        price: 25.0,
        quantity: 10,
      };

      const validatedItem2 = {
        id: itemId2,
        name: 'Item 2',
        price: 50.0,
        quantity: 5,
      };

      const validatedItem3 = {
        id: itemId3,
        name: 'Item 3',
        price: 15.0,
        quantity: 20,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValueOnce(validatedItem1)
        .mockResolvedValueOnce(validatedItem2)
        .mockResolvedValueOnce(validatedItem3);

      const result = await ProccessOrderItemUseCase.proccessOrderItem(
        orderData,
        itemGatewayMock,
      );

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        itemId: itemId1,
        quantity: 2,
        price: 25.0,
      });
      expect(result[1]).toEqual({
        itemId: itemId2,
        quantity: 1,
        price: 50.0,
      });
      expect(result[2]).toEqual({
        itemId: itemId3,
        quantity: 3,
        price: 15.0,
      });
      expect(ValidItemOrderUseCase.validItemOrderUseCase).toHaveBeenCalledTimes(3);
    });

    it('should return empty array when orderItems is undefined', async () => {
      const orderData: any = {};

      const validItemSpy = jest.spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase');

      const result = await ProccessOrderItemUseCase.proccessOrderItem(
        orderData,
        itemGatewayMock,
      );

      expect(result).toEqual([]);
      expect(validItemSpy).not.toHaveBeenCalled();
    });

    it('should return empty array when orderItems is empty', async () => {
      const orderData: OrderInterface = {
        orderItems: [],
      };

      const validItemSpy = jest.spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase');

      const result = await ProccessOrderItemUseCase.proccessOrderItem(
        orderData,
        itemGatewayMock,
      );

      expect(result).toEqual([]);
      expect(validItemSpy).not.toHaveBeenCalled();
    });

    it('should throw error when validated item is null', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(null as any);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow(`Item validation failed for item ID: ${itemId}`);
    });

    it('should throw error when validated item has no id', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      const validatedItem = {
        id: undefined,
        name: 'Test Item',
        price: 25.0,
        quantity: 10,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(validatedItem as any);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow(`Item validation failed for item ID: ${itemId}`);
    });

    it('should throw error when validated item has no price', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      const validatedItem = {
        id: itemId,
        name: 'Test Item',
        price: undefined,
        quantity: 10,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(validatedItem as any);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow(`Item validation failed for item ID: ${itemId}`);
    });

    it('should throw error when validated item has price equal to zero', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      const validatedItem = {
        id: itemId,
        name: 'Test Item',
        price: 0,
        quantity: 10,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(validatedItem);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow(`Item validation failed for item ID: ${itemId}`);
    });

    it('should throw error when order item quantity is zero', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 0,
          },
        ],
      };

      const validatedItem = {
        id: itemId,
        name: 'Test Item',
        price: 25.0,
        quantity: 10,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValue(validatedItem);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow(`Item validation failed for item ID: ${itemId}`);
    });


    it('should process items with different quantities correctly', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          { itemId: itemId1, itemQuantity: 5 },
          { itemId: itemId2, itemQuantity: 10 },
        ],
      };

      const validatedItem1 = {
        id: itemId1,
        name: 'Item 1',
        price: 20.0,
        quantity: 50,
      };

      const validatedItem2 = {
        id: itemId2,
        name: 'Item 2',
        price: 30.0,
        quantity: 100,
      };

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValueOnce(validatedItem1)
        .mockResolvedValueOnce(validatedItem2);

      const result = await ProccessOrderItemUseCase.proccessOrderItem(
        orderData,
        itemGatewayMock,
      );

      expect(result).toHaveLength(2);
      expect(result[0].quantity).toBe(5);
      expect(result[1].quantity).toBe(10);
    });

    it('should call ValidItemOrderUseCase for each item in correct order', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          { itemId: itemId1, itemQuantity: 1 },
          { itemId: itemId2, itemQuantity: 2 },
          { itemId: itemId3, itemQuantity: 3 },
        ],
      };

      const validatedItem1 = {
        id: itemId1,
        name: 'Item 1',
        price: 10.0,
        quantity: 10,
      };

      const validatedItem2 = {
        id: itemId2,
        name: 'Item 2',
        price: 20.0,
        quantity: 20,
      };

      const validatedItem3 = {
        id: itemId3,
        name: 'Item 3',
        price: 30.0,
        quantity: 30,
      };

      const validItemSpy = jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockResolvedValueOnce(validatedItem1)
        .mockResolvedValueOnce(validatedItem2)
        .mockResolvedValueOnce(validatedItem3);

      await ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock);

      expect(validItemSpy).toHaveBeenNthCalledWith(
        1,
        orderData.orderItems[0],
        itemGatewayMock,
      );
      expect(validItemSpy).toHaveBeenNthCalledWith(
        2,
        orderData.orderItems[1],
        itemGatewayMock,
      );
      expect(validItemSpy).toHaveBeenNthCalledWith(
        3,
        orderData.orderItems[2],
        itemGatewayMock,
      );
    });

    it('should propagate error from ValidItemOrderUseCase', async () => {
      const itemId = uuidv4();

      const orderData: OrderInterface = {
        orderItems: [
          {
            itemId: itemId,
            itemQuantity: 2,
          },
        ],
      };

      const error = new Error('Validation error');

      jest
        .spyOn(ValidItemOrderUseCase, 'validItemOrderUseCase')
        .mockRejectedValue(error);

      await expect(
        ProccessOrderItemUseCase.proccessOrderItem(orderData, itemGatewayMock),
      ).rejects.toThrow('Validation error');
    });
  });
});
