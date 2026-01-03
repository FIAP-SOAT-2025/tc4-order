import { CustomerClient } from './customer.client';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CustomerClient', () => {
  let customerClient: CustomerClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      defaults: {
        baseURL: 'http://customer-service:3000',
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    customerClient = new CustomerClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://api-service.tc4-customer.svc.cluster.local:8080',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create axios instance with correct headers', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });
  });

  describe('findByCpfExternally', () => {
    it('should return customer when found', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();
      const expectedResponse: CustomerExternallyResponse = {
        id: customerId,
        email: 'customer@example.com',
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: expectedResponse,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toEqual(expectedResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/order/customer/cpf/${cpf}`,
      );
    });

    it('should call correct endpoint with cpf', async () => {
      const cpf = '98765432100';
      const customerId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: {
          id: customerId,
          email: 'test@test.com',
        },
      });

      await customerClient.findByCpfExternally(cpf);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/order/customer/cpf/${cpf}`,
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should return customer with valid UUID', async () => {
      const cpf = '11111111111';
      const customerId = uuidv4();

      // Validate UUID format
      expect(customerId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const customerResponse: CustomerExternallyResponse = {
        id: customerId,
        email: 'uuid@example.com',
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: customerResponse,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result?.id).toBe(customerId);
      expect(result?.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should return null when response data is empty', async () => {
      const cpf = '12345678901';

      mockAxiosInstance.get.mockResolvedValue({
        data: null,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should return null when response data is undefined', async () => {
      const cpf = '12345678901';

      mockAxiosInstance.get.mockResolvedValue({
        data: undefined,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should return null when customer not found (404)', async () => {
      const cpf = '99999999999';

      const error: any = new Error('Not Found');
      error.response = {
        status: 404,
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should return customer with different email formats', async () => {
      const emails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example.org',
      ];

      for (const email of emails) {
        const cpf = '12345678901';
        const customerId = uuidv4();
        const customerResponse: CustomerExternallyResponse = {
          id: customerId,
          email: email,
        };

        mockAxiosInstance.get.mockResolvedValue({
          data: customerResponse,
        });

        const result = await customerClient.findByCpfExternally(cpf);

        expect(result?.email).toBe(email);
      }
    });

    it('should handle different CPF formats', async () => {
      const cpfs = [
        '12345678901',
        '98765432100',
        '11111111111',
        '00000000000',
      ];

      for (const cpf of cpfs) {
        const customerId = uuidv4();
        mockAxiosInstance.get.mockResolvedValue({
          data: {
            id: customerId,
            email: 'test@example.com',
          },
        });

        await customerClient.findByCpfExternally(cpf);

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/order/customer/cpf/${cpf}`,
        );
      }
    });

    it('should return customer data from external service', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();
      const customerData: CustomerExternallyResponse = {
        id: customerId,
        email: 'external@service.com',
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: customerData,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toEqual(customerData);
    });

    it('should throw error when service fails with 500', async () => {
      const cpf = '12345678901';

      const error: any = new Error('Internal Server Error');
      error.response = {
        status: 500,
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should throw error when network fails', async () => {
      const cpf = '12345678901';

      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should throw error when service is unavailable', async () => {
      const cpf = '12345678901';

      const error: any = new Error('Service Unavailable');
      error.response = {
        status: 503,
      };

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should handle timeout errors', async () => {
      const cpf = '12345678901';

      const error = new Error('timeout of 5000ms exceeded');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should return null only for 404 errors', async () => {
      const cpf = '12345678901';

      const error404: any = new Error('Not Found');
      error404.response = { status: 404 };

      mockAxiosInstance.get.mockRejectedValue(error404);

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should throw error for non-404 HTTP errors', async () => {
      const cpf = '12345678901';

      const error400: any = new Error('Bad Request');
      error400.response = { status: 400 };

      mockAxiosInstance.get.mockRejectedValue(error400);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should handle multiple sequential calls', async () => {
      const cpf1 = '11111111111';
      const cpf2 = '22222222222';
      const customerId1 = uuidv4();
      const customerId2 = uuidv4();

      const response1: CustomerExternallyResponse = {
        id: customerId1,
        email: 'customer1@example.com',
      };

      const response2: CustomerExternallyResponse = {
        id: customerId2,
        email: 'customer2@example.com',
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: response1 })
        .mockResolvedValueOnce({ data: response2 });

      const result1 = await customerClient.findByCpfExternally(cpf1);
      const result2 = await customerClient.findByCpfExternally(cpf2);

      expect(result1).toEqual(response1);
      expect(result2).toEqual(response2);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should return customer with id and email properties', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();
      const customerResponse: CustomerExternallyResponse = {
        id: customerId,
        email: 'properties@test.com',
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: customerResponse,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result?.id).toBe(customerId);
      expect(result?.email).toBe('properties@test.com');
    });

    it('should handle CPF with 11 digits', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();

      expect(cpf).toHaveLength(11);

      mockAxiosInstance.get.mockResolvedValue({
        data: {
          id: customerId,
          email: 'eleven@example.com',
        },
      });

      await customerClient.findByCpfExternally(cpf);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/order/customer/cpf/${cpf}`,
      );
    });

    it('should return exact response from external API', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();
      const apiResponse: CustomerExternallyResponse = {
        id: customerId,
        email: 'exact@response.com',
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: apiResponse,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBe(apiResponse);
    });

    it('should handle empty string response data as null', async () => {
      const cpf = '12345678901';

      mockAxiosInstance.get.mockResolvedValue({
        data: '',
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should handle false response data as null', async () => {
      const cpf = '12345678901';

      mockAxiosInstance.get.mockResolvedValue({
        data: false,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should handle 0 response data as null', async () => {
      const cpf = '12345678901';

      mockAxiosInstance.get.mockResolvedValue({
        data: 0,
      });

      const result = await customerClient.findByCpfExternally(cpf);

      expect(result).toBeNull();
    });

    it('should make GET request to correct URL path', async () => {
      const cpf = '55555555555';
      const customerId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: {
          id: customerId,
          email: 'path@test.com',
        },
      });

      await customerClient.findByCpfExternally(cpf);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/order/customer/cpf/${cpf}`,
      );
    });

    it('should return customer with different UUID formats', async () => {
      const cpf = '12345678901';
      const customerIds = [uuidv4(), uuidv4(), uuidv4()];

      for (const customerId of customerIds) {
        expect(customerId).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );

        mockAxiosInstance.get.mockResolvedValue({
          data: {
            id: customerId,
            email: 'uuid@test.com',
          },
        });

        const result = await customerClient.findByCpfExternally(cpf);

        expect(result?.id).toBe(customerId);
      }
    });

    it('should propagate error message from external service', async () => {
      const cpf = '12345678901';

      const error = new Error('Custom external service error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should handle error without response property', async () => {
      const cpf = '12345678901';

      const error = new Error('Error without response');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(customerClient.findByCpfExternally(cpf)).rejects.toThrow(
        'Failed to fetch customer from external service',
      );
    });

    it('should call axios get only once per request', async () => {
      const cpf = '12345678901';
      const customerId = uuidv4();

      mockAxiosInstance.get.mockResolvedValue({
        data: {
          id: customerId,
          email: 'single@call.com',
        },
      });

      await customerClient.findByCpfExternally(cpf);

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });
  });
});
