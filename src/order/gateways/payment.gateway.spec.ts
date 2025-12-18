import { PaymentGateway } from './payment.gateway';
import { PaymentClientInterface } from '../interfaces/clients-interfaces/payment-client.interface';
import {
  InputPayment,
  PaymentExternallyResponse,
} from '../interfaces/responses-interfaces/payment-response.interface';
import { v4 as uuidv4 } from 'uuid';

describe('PaymentGateway', () => {
  let paymentGateway: PaymentGateway;
  let paymentClientMock: jest.Mocked<PaymentClientInterface>;

  beforeEach(() => {
    paymentClientMock = {
      createPaymentExternal: jest.fn(),
      getPaymentStatus: jest.fn(),
    } as jest.Mocked<PaymentClientInterface>;

    paymentGateway = new PaymentGateway(paymentClientMock);
  });

  describe('createPaymentGateway', () => {
    it('should create payment successfully', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'customer@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const expectedResponse: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(
        expectedResponse,
      );

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toEqual(expectedResponse);
      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledWith(
        input,
      );
      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledTimes(1);
    });

    it('should call paymentClient with correct input', async () => {
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

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      await paymentGateway.createPaymentGateway(input);

      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledWith(
        input,
      );
    });

    it('should create payment with valid UUID orderId', async () => {
      const orderId = uuidv4();

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
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result.paymentId).toBeDefined();
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

        paymentClientMock.createPaymentExternal.mockResolvedValue(response);

        const result = await paymentGateway.createPaymentGateway(input);

        expect(result).toEqual(response);
        expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledWith(
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

        paymentClientMock.createPaymentExternal.mockResolvedValue(response);

        const result = await paymentGateway.createPaymentGateway(input);

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

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result.status).toBe('pending');
    });

    it('should return payment response with all required fields', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'fields@example.com',
        totalAmount: 75.0,
        orderId: orderId,
      };

      const paymentId = uuidv4();
      const response: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

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

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toEqual(response);
    });

    it('should handle small amount values', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'small@example.com',
        totalAmount: 0.01,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toEqual(response);
    });

    it('should create payment with decimal amounts', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'decimal@example.com',
        totalAmount: 123.45,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toEqual(response);
    });

    it('should return response from paymentClient', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'return@example.com',
        totalAmount: 50.0,
        orderId: orderId,
      };

      const expectedResponse: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(
        expectedResponse,
      );

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toBe(expectedResponse);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when paymentClient fails', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'error@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const error = new Error('Payment service unavailable');
      paymentClientMock.createPaymentExternal.mockRejectedValue(error);

      await expect(
        paymentGateway.createPaymentGateway(input),
      ).rejects.toThrow('Payment service unavailable');
    });

    it('should throw error when network fails', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'network@example.com',
        totalAmount: 75.0,
        orderId: orderId,
      };

      const error = new Error('Network error');
      paymentClientMock.createPaymentExternal.mockRejectedValue(error);

      await expect(
        paymentGateway.createPaymentGateway(input),
      ).rejects.toThrow('Network error');
    });

    it('should propagate errors from paymentClient', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'propagate@example.com',
        totalAmount: 200.0,
        orderId: orderId,
      };

      const error = new Error('External API error');
      paymentClientMock.createPaymentExternal.mockRejectedValue(error);

      await expect(
        paymentGateway.createPaymentGateway(input),
      ).rejects.toThrow(error);
    });

    it('should create payment with multiple different orderIds', async () => {
      const orderIds = [uuidv4(), uuidv4(), uuidv4()];

      for (const orderId of orderIds) {
        const input: InputPayment = {
          email: 'multiple@example.com',
          totalAmount: 50.0,
          orderId: orderId,
        };

        const response: PaymentExternallyResponse = {
          paymentId: uuidv4(),
          status: 'pending',
        };

        paymentClientMock.createPaymentExternal.mockResolvedValue(response);

        const result = await paymentGateway.createPaymentGateway(input);

        expect(result).toEqual(response);
        expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledWith(
          input,
        );
      }
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
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal
        .mockResolvedValueOnce(response1)
        .mockResolvedValueOnce(response2);

      const result1 = await paymentGateway.createPaymentGateway(input1);
      const result2 = await paymentGateway.createPaymentGateway(input2);

      expect(result1).toEqual(response1);
      expect(result2).toEqual(response2);
      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledTimes(2);
    });

    it('should verify paymentClient is called only once per request', async () => {
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

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      await paymentGateway.createPaymentGateway(input);

      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledTimes(1);
    });

    it('should create payment with international email', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'user@example.co.jp',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result).toEqual(response);
    });

    it('should handle timeout errors', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'timeout@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const error = new Error('Request timeout');
      paymentClientMock.createPaymentExternal.mockRejectedValue(error);

      await expect(
        paymentGateway.createPaymentGateway(input),
      ).rejects.toThrow('Request timeout');
    });

    it('should create payment and preserve input data', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'preserve@example.com',
        totalAmount: 250.75,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'pending',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      await paymentGateway.createPaymentGateway(input);

      expect(paymentClientMock.createPaymentExternal).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'preserve@example.com',
          totalAmount: 250.75,
          orderId: orderId,
        }),
      );
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

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result.status).toBe('approved');
    });

    it('should return payment with rejected status', async () => {
      const orderId = uuidv4();
      const input: InputPayment = {
        email: 'rejected@example.com',
        totalAmount: 100.0,
        orderId: orderId,
      };

      const response: PaymentExternallyResponse = {
        paymentId: uuidv4(),
        status: 'rejected',
      };

      paymentClientMock.createPaymentExternal.mockResolvedValue(response);

      const result = await paymentGateway.createPaymentGateway(input);

      expect(result.status).toBe('rejected');
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

        paymentClientMock.createPaymentExternal.mockResolvedValue(response);

        const result = await paymentGateway.createPaymentGateway(input);

        expect(result.status).toBe(status);
      }
    });
  });
});
