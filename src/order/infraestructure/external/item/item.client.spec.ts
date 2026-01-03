import { ItemClient } from './item.client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ItemClient', () => {
  let itemClient: ItemClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      patch: jest.fn(),
      defaults: {
        baseURL: 'http://localhost:3000',
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    itemClient = new ItemClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://api-service.tc4-item.svc.cluster.local:8080',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('getItemExternally', () => {
    it('should successfully fetch item data', async () => {
      const itemId = uuidv4();
      const mockItemResponse = {
        id: itemId,
        quantity: 10,
        price: 50.0,
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockItemResponse,
      });

      const result = await itemClient.getItemExternally(itemId);

      expect(result).toEqual(mockItemResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/item/${itemId}`);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should return null when response data is empty', async () => {
      const itemId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: null,
      });

      const result = await itemClient.getItemExternally(itemId);

      expect(result).toBeNull();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/item/${itemId}`);
    });

    it('should return null when response data is undefined', async () => {
      const itemId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: undefined,
      });

      const result = await itemClient.getItemExternally(itemId);

      expect(result).toBeNull();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/item/${itemId}`);
    });

    it('should throw error when API call fails', async () => {
      const itemId = uuidv4();
      const error = new Error('Network error');

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(itemClient.getItemExternally(itemId)).rejects.toThrow(
        `Error fetching item with id ${itemId}`,
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/item/${itemId}`);
    });

    it('should throw error on 404 error', async () => {
      const itemId = uuidv4();
      const error = {
        response: {
          status: 404,
          data: { message: 'Item not found' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(itemClient.getItemExternally(itemId)).rejects.toThrow(
        `Error fetching item with id ${itemId}`,
      );
    });

    it('should throw error on 500 error', async () => {
      const itemId = uuidv4();
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(itemClient.getItemExternally(itemId)).rejects.toThrow(
        `Error fetching item with id ${itemId}`,
      );
    });

    it('should fetch item with all properties correctly', async () => {
      const itemId = uuidv4();
      const mockItemResponse = {
        id: itemId,
        quantity: 25,
        price: 99.99,
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockItemResponse,
      });

      const result = await itemClient.getItemExternally(itemId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(itemId);
      expect(result?.quantity).toBe(25);
      expect(result?.price).toBe(99.99);
    });

    it('should fetch multiple different items successfully', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockItem1 = {
        id: itemId1,
        quantity: 5,
        price: 10.0,
      };

      const mockItem2 = {
        id: itemId2,
        quantity: 15,
        price: 20.0,
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockItem1 })
        .mockResolvedValueOnce({ data: mockItem2 });

      const result1 = await itemClient.getItemExternally(itemId1);
      const result2 = await itemClient.getItemExternally(itemId2);

      expect(result1).toEqual(mockItem1);
      expect(result2).toEqual(mockItem2);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateItemQuantityExternally', () => {
    it('should successfully update item quantity', async () => {
      const itemId = uuidv4();
      const quantity = 10;

      mockAxiosInstance.patch.mockResolvedValue({ data: {} });

      await itemClient.updateItemQuantityExternally(itemId, quantity);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/item/${itemId}`, {
        quantity,
      });
      expect(mockAxiosInstance.patch).toHaveBeenCalledTimes(1);
    });

    it('should update item quantity to zero', async () => {
      const itemId = uuidv4();
      const quantity = 0;

      mockAxiosInstance.patch.mockResolvedValue({ data: {} });

      await itemClient.updateItemQuantityExternally(itemId, quantity);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/item/${itemId}`, {
        quantity: 0,
      });
    });

    it('should update item quantity with large number', async () => {
      const itemId = uuidv4();
      const quantity = 1000;

      mockAxiosInstance.patch.mockResolvedValue({ data: {} });

      await itemClient.updateItemQuantityExternally(itemId, quantity);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/item/${itemId}`, {
        quantity: 1000,
      });
    });

    it('should throw error when update fails', async () => {
      const itemId = uuidv4();
      const quantity = 10;
      const error = new Error('Update failed');

      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(
        itemClient.updateItemQuantityExternally(itemId, quantity),
      ).rejects.toThrow(`Error updating item quantity for id ${itemId}`);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/item/${itemId}`, {
        quantity,
      });
    });

    it('should throw error on 404 when item does not exist', async () => {
      const itemId = uuidv4();
      const quantity = 10;
      const error = {
        response: {
          status: 404,
          data: { message: 'Item not found' },
        },
      };

      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(
        itemClient.updateItemQuantityExternally(itemId, quantity),
      ).rejects.toThrow(`Error updating item quantity for id ${itemId}`);
    });

    it('should throw error on 500 during update', async () => {
      const itemId = uuidv4();
      const quantity = 10;
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };

      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(
        itemClient.updateItemQuantityExternally(itemId, quantity),
      ).rejects.toThrow(`Error updating item quantity for id ${itemId}`);
    });

    it('should update multiple items sequentially', async () => {
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const quantity1 = 5;
      const quantity2 = 15;

      mockAxiosInstance.patch.mockResolvedValue({ data: {} });

      await itemClient.updateItemQuantityExternally(itemId1, quantity1);
      await itemClient.updateItemQuantityExternally(itemId2, quantity2);

      expect(mockAxiosInstance.patch).toHaveBeenCalledTimes(2);
      expect(mockAxiosInstance.patch).toHaveBeenNthCalledWith(1, `/item/${itemId1}`, {
        quantity: quantity1,
      });
      expect(mockAxiosInstance.patch).toHaveBeenNthCalledWith(2, `/item/${itemId2}`, {
        quantity: quantity2,
      });
    });

    it('should throw error on network timeout', async () => {
      const itemId = uuidv4();
      const quantity = 10;
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };

      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(
        itemClient.updateItemQuantityExternally(itemId, quantity),
      ).rejects.toThrow(`Error updating item quantity for id ${itemId}`);
    });
  });

  describe('API endpoint format', () => {
    it('should call correct endpoint for getItemExternally', async () => {
      const itemId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: { id: itemId, quantity: 10, price: 50.0 },
      });

      await itemClient.getItemExternally(itemId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/item/${itemId}`);
    });

    it('should call correct endpoint for updateItemQuantityExternally', async () => {
      const itemId = uuidv4();
      const quantity = 10;

      mockAxiosInstance.patch.mockResolvedValue({ data: {} });

      await itemClient.updateItemQuantityExternally(itemId, quantity);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        `/item/${itemId}`,
        expect.any(Object),
      );
    });
  });
});
