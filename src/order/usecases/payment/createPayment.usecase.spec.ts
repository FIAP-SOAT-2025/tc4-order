import { CreatePaymentUseCase } from './createPayment.usecase';
import { PaymentGatewayInterface } from 'src/order/interfaces/gateways-interfaces/payment-gateway.interface';
import {
  InputPayment,
  PaymentExternallyResponse,
} from 'src/order/interfaces/responses-interfaces/payment-response.interface';
import { v4 as uuidv4 } from 'uuid';

describe('CreatePaymentUseCase', () => {
  let createPaymentUseCase: CreatePaymentUseCase;
  let paymentGatewayMock: jest.Mocked<PaymentGatewayInterface>;

  beforeEach(() => {
    paymentGatewayMock = {
      createPaymentGateway: jest.fn(),
    };

    createPaymentUseCase = new CreatePaymentUseCase(paymentGatewayMock);
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'customer@example.com';
      const totalAmount = 100.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result).toEqual({
        paymentId: paymentId,
        status: 'PENDING',
      });
      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith({
        email: email,
        totalAmount: totalAmount,
        orderId: orderId,
      });
      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledTimes(1);
    });

    it('should create payment with correct payment input', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'test@test.com';
      const totalAmount = 250.5;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'APPROVED',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      const expectedInput: InputPayment = {
        email: email,
        totalAmount: totalAmount,
        orderId: orderId,
      };

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expectedInput,
      );
    });

    it('should return payment with paymentId and status', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'user@domain.com';
      const totalAmount = 75.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result).toHaveProperty('paymentId', paymentId);
      expect(result).toHaveProperty('status', 'PENDING');
      expect(Object.keys(result)).toHaveLength(2);
    });

    it('should create payment with different status values', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'test@example.com';
      const totalAmount = 150.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'APPROVED',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result.status).toBe('APPROVED');
    });

    it('should create payment with REJECTED status', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'rejected@test.com';
      const totalAmount = 50.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'REJECTED',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result.status).toBe('REJECTED');
    });

    it('should handle different total amounts', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'amount@test.com';
      const totalAmount = 999.99;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 999.99,
        }),
      );
    });

    it('should handle small total amounts', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'small@test.com';
      const totalAmount = 0.01;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 0.01,
        }),
      );
    });

    it('should pass correct email to payment gateway', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'specific@email.com';
      const totalAmount = 100.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'specific@email.com',
        }),
      );
    });

    it('should pass correct orderId to payment gateway', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'order@test.com';
      const totalAmount = 200.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: orderId,
        }),
      );
    });

    it('should return paymentId from gateway response', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'gateway@test.com';
      const totalAmount = 300.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result.paymentId).toBe(paymentId);
    });

    it('should return status from gateway response', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'status@test.com';
      const totalAmount = 400.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PROCESSING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result.status).toBe('PROCESSING');
    });

    it('should throw error when payment gateway fails', async () => {
      const orderId = uuidv4();
      const email = 'error@test.com';
      const totalAmount = 100.0;

      const error = new Error('Payment gateway error');
      paymentGatewayMock.createPaymentGateway.mockRejectedValue(error);

      await expect(
        createPaymentUseCase.createPayment(email, orderId, totalAmount),
      ).rejects.toThrow('Payment gateway error');
    });

    it('should handle payment gateway network errors', async () => {
      const orderId = uuidv4();
      const email = 'network@test.com';
      const totalAmount = 100.0;

      const networkError = new Error('Network timeout');
      paymentGatewayMock.createPaymentGateway.mockRejectedValue(networkError);

      await expect(
        createPaymentUseCase.createPayment(email, orderId, totalAmount),
      ).rejects.toThrow('Network timeout');
    });

    it('should create payment with valid UUID for orderId', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'uuid@test.com';
      const totalAmount = 100.0;

      // Validate UUID format
      expect(orderId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: orderId,
        }),
      );
    });

    it('should create payment with valid UUID for paymentId', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'payment-uuid@test.com';
      const totalAmount = 100.0;

      // Validate UUID format
      expect(paymentId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result.paymentId).toBe(paymentId);
    });

    it('should handle email with different formats', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'Test.User+Tag@Example.COM';
      const totalAmount = 100.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'Test.User+Tag@Example.COM',
        }),
      );
    });

    it('should handle large total amounts', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'large@test.com';
      const totalAmount = 9999999.99;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      await createPaymentUseCase.createPayment(email, orderId, totalAmount);

      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 9999999.99,
        }),
      );
    });

    it('should preserve payment response data without modification', async () => {
      const orderId = uuidv4();
      const paymentId = uuidv4();
      const email = 'preserve@test.com';
      const totalAmount = 100.0;

      const mockPaymentResponse: PaymentExternallyResponse = {
        paymentId: paymentId,
        status: 'PENDING',
      };

      paymentGatewayMock.createPaymentGateway.mockResolvedValue(
        mockPaymentResponse,
      );

      const result = await createPaymentUseCase.createPayment(
        email,
        orderId,
        totalAmount,
      );

      expect(result).toEqual(mockPaymentResponse);
    });

    it('should handle multiple sequential payment creations', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const paymentId1 = uuidv4();
      const paymentId2 = uuidv4();

      const mockPaymentResponse1: PaymentExternallyResponse = {
        paymentId: paymentId1,
        status: 'PENDING',
      };

      const mockPaymentResponse2: PaymentExternallyResponse = {
        paymentId: paymentId2,
        status: 'APPROVED',
      };

      paymentGatewayMock.createPaymentGateway
        .mockResolvedValueOnce(mockPaymentResponse1)
        .mockResolvedValueOnce(mockPaymentResponse2);

      const result1 = await createPaymentUseCase.createPayment(
        'first@test.com',
        orderId1,
        100.0,
      );
      const result2 = await createPaymentUseCase.createPayment(
        'second@test.com',
        orderId2,
        200.0,
      );

      expect(result1.paymentId).toBe(paymentId1);
      expect(result1.status).toBe('PENDING');
      expect(result2.paymentId).toBe(paymentId2);
      expect(result2.status).toBe('APPROVED');
      expect(paymentGatewayMock.createPaymentGateway).toHaveBeenCalledTimes(2);
    });
  });
});
