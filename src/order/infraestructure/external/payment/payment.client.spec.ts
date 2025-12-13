import { PaymentClient } from './payment.client';
import {
  InputPayment,
  PaymentExternallyResponse,
} from 'src/order/interfaces/responses-interfaces/payment-response.interface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaymentClient', () => {
  let paymentClient: PaymentClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      patch: jest.fn(),
      defaults: {
        baseURL: 'http://payment-service:3000',
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    paymentClient = new PaymentClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: process.env.PAYMENT_SERVICE_URL,
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

  describe('createPaymentExternal', () => {
    it('should create payment successfully', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const input: InputPayment = {
        email: 'customer@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const expectedResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: expectedResponse,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result).toEqual(expectedResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/order/payment/checkout',
        input,
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });

    it('should call correct endpoint with payment data', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'test@test.com',
        totalAmount: 50.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      await paymentClient.createPaymentExternal(input);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/order/payment/checkout',
        input,
      );
    });

    it('should create payment with valid UUID orderId', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();

      // Validate UUID format
      expect(orderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const input: InputPayment = {
        email: 'uuid@example.com',
        totalAmount: 75.5,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result.paymentId).toBeDefined();
      expect(result.paymentId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should create payment with different email formats', async () => {
      const emails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example.org',
      ];

      for (const email of emails) {
        const orderId = uuidv4();
        const input: InputPayment = {
          email: email,
          totalAmount: 25.0,
          orderId: orderId,
        };

        const response: PaymentExternallyResponse = {
          paymentId: uuidv4(),
          status: 'pending',
        };

        mockAxiosInstance.post.mockResolvedValue({
          data: response,
        });

        const result = await paymentClient.createPaymentExternal(input);

        expect(result).toEqual(response);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/order/payment/checkout',
          input,
        );
      }
    });

    it('should create payment with different amounts', async () => {
      const amounts = [0.01, 10.5, 100.0, 999.99, 9999.99];

      for (const amount of amounts) {
        const orderId = uuidv4();
        const input: InputPayment = {
          email: 'amount@test.com',
          totalAmount: amount,
          orderId: orderId,
        };

        const response: PaymentExternallyResponse = {
          paymentId: uuidv4(),
          status: 'pending',
        };

        mockAxiosInstance.post.mockResolvedValue({
          data: response,
        });

        const result = await paymentClient.createPaymentExternal(input);

        expect(result).toEqual(response);
      }
    });

    it('should return payment response with status pending', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'status@example.com',
        totalAmount: 200.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result.status).toBe('pending');
    });

    it('should return payment response with all required fields', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const input: InputPayment = {
        email: 'fields@example.com',
        totalAmount: 75.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result).toHaveProperty('paymentId');
      expect(result).toHaveProperty('status');
      expect(result.paymentId).toBe(paymentId);
      expect(result.status).toBe('pending');
    });

    it('should handle large amount values', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'large@example.com',
        totalAmount: 999999.99,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result).toEqual(response);
    });

    it('should throw error when payment service fails', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'error@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const error = new Error('Payment service unavailable');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(paymentClient.createPaymentExternal(input)).rejects.toThrow(
        'Payment service unavailable',
      );
    });

    it('should throw error when network fails', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'network@example.com',
        totalAmount: 75.0,
        orderId: orderId,
      };

      const error = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(paymentClient.createPaymentExternal(input)).rejects.toThrow(
        'Network error',
      );
    });

    it('should make POST request to correct endpoint', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'endpoint@test.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      await paymentClient.createPaymentExternal(input);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/order/payment/checkout',
        expect.any(Object),
      );
    });

    it('should return exact response from external API', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'exact@response.com',
        totalAmount: 50.0,
        orderId: orderId,
      };

      const apiResponse: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'approved',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: apiResponse,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result).toBe(apiResponse);
    });

    it('should handle sequential payment creations', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();

      const input1: InputPayment = {
        email: 'sequential1@example.com',
        totalAmount: 50.0,
        orderId: orderId1,
      };

      const input2: InputPayment = {
        email: 'sequential2@example.com',
        totalAmount: 75.0,
        orderId: orderId2,
      };

      const response1: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      const response2: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'approved',
      };

      mockAxiosInstance.post
        .mockResolvedValueOnce({ data: response1 })
        .mockResolvedValueOnce({ data: response2 });

      const result1 = await paymentClient.createPaymentExternal(input1);
      const result2 = await paymentClient.createPaymentExternal(input2);

      expect(result1).toEqual(response1);
      expect(result2).toEqual(response2);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
    });

    it('should return payment with approved status', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'approved@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'approved',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.createPaymentExternal(input);

      expect(result.status).toBe('approved');
    });

    it('should handle different status values', async () => {
      const statuses = ['pending', 'approved', 'rejected', 'processing'];

      for (const status of statuses) {
        const orderId = uuidv4();
        const input: InputPayment = {
          email: 'status@test.com',
          totalAmount: 50.0,
          orderId: orderId,
        };

        const response: PaymentExternallyResponse = {
          paymentId: uuidv4(),
          status: status,
        };

        mockAxiosInstance.post.mockResolvedValue({
          data: response,
        });

        const result = await paymentClient.createPaymentExternal(input);

        expect(result.status).toBe(status);
      }
    });

    it('should call axios post only once per request', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'once@example.com',
        totalAmount: 50.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: response,
      });

      await paymentClient.createPaymentExternal(input);

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service returns 500', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'error500@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const error: any = new Error('Internal Server Error');
      error.response = { status: 500 };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(paymentClient.createPaymentExternal(input)).rejects.toThrow(
        'Internal Server Error',
      );
    });
  });

  describe('getPaymentStatus', () => {
    it('should get payment status successfully', async () => {
      const paymentId = uuidv4();
      const expectedResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: expectedResponse,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result).toEqual(expectedResponse);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        `/order/payment-status/${paymentId}`,
      );
      expect(mockAxiosInstance.patch).toHaveBeenCalledTimes(1);
    });

    it('should call correct endpoint with paymentId', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      await paymentClient.getPaymentStatus(paymentId);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        `/order/payment-status/${paymentId}`,
      );
    });

    it('should get payment status with valid UUID', async () => {
      const paymentId = uuidv4();

      // Validate UUID format
      expect(paymentId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result.paymentId).toBe(paymentId);
      expect(result.paymentId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should return status pending', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result.status).toBe('pending');
    });

    it('should return status approved', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result.status).toBe('approved');
    });

    it('should return status rejected', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'rejected',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result.status).toBe('rejected');
    });

    it('should handle different status values', async () => {
      const statuses = ['pending', 'approved', 'rejected', 'processing'];

      for (const status of statuses) {
        const paymentId = uuidv4();
        const response: PaymentExternallyResponse = {
          paymentId: paymentId,
          status: status,
        };

        mockAxiosInstance.patch.mockResolvedValue({
          data: response,
        });

        const result = await paymentClient.getPaymentStatus(paymentId);

        expect(result.status).toBe(status);
      }
    });

    it('should return response from external service', async () => {
      const paymentId = uuidv4();
      const apiResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: apiResponse,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result).toBe(apiResponse);
    });

    it('should throw error when payment not found', async () => {
      const paymentId = uuidv4();

      const error: any = new Error('Not Found');
      error.response = { status: 404 };
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(paymentClient.getPaymentStatus(paymentId)).rejects.toThrow(
        'Not Found',
      );
    });

    it('should throw error when service fails', async () => {
      const paymentId = uuidv4();

      const error = new Error('Service unavailable');
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(paymentClient.getPaymentStatus(paymentId)).rejects.toThrow(
        'Service unavailable',
      );
    });

    it('should throw error when network fails', async () => {
      const paymentId = uuidv4();

      const error = new Error('Network error');
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(paymentClient.getPaymentStatus(paymentId)).rejects.toThrow(
        'Network error',
      );
    });

    it('should handle multiple sequential status checks', async () => {
      const paymentId1 = uuidv4();
      const paymentId2 = uuidv4();

      const response1: PaymentExternallyResponse = {
        paymentId: paymentId1,
        status: 'pending',
      };

      const response2: PaymentExternallyResponse = {
        paymentId: paymentId2,
        status: 'approved',
      };

      mockAxiosInstance.patch
        .mockResolvedValueOnce({ data: response1 })
        .mockResolvedValueOnce({ data: response2 });

      const result1 = await paymentClient.getPaymentStatus(paymentId1);
      const result2 = await paymentClient.getPaymentStatus(paymentId2);

      expect(result1).toEqual(response1);
      expect(result2).toEqual(response2);
      expect(mockAxiosInstance.patch).toHaveBeenCalledTimes(2);
    });

    it('should make PATCH request to correct URL', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      await paymentClient.getPaymentStatus(paymentId);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        `/order/payment-status/${paymentId}`,
      );
    });

    it('should return payment with all required fields', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      const result = await paymentClient.getPaymentStatus(paymentId);

      expect(result).toHaveProperty('paymentId');
      expect(result).toHaveProperty('status');
    });

    it('should call axios patch only once per request', async () => {
      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'approved',
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: response,
      });

      await paymentClient.getPaymentStatus(paymentId);

      expect(mockAxiosInstance.patch).toHaveBeenCalledTimes(1);
    });

    it('should handle timeout errors', async () => {
      const paymentId = uuidv4();

      const error = new Error('timeout of 5000ms exceeded');
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(paymentClient.getPaymentStatus(paymentId)).rejects.toThrow(
        'timeout of 5000ms exceeded',
      );
    });
  });
});
