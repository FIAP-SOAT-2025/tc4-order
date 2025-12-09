/* eslint-disable prettier/prettier */
import { PaymentGateway } from '../../gateways/payment.gateway';
import { PaymentClientInterface } from '../../interfaces/clients-interfaces/payment-client.interface';
import { InputPayment, PaymentExternallyResponse } from '../../interfaces/responses-interfaces/payment-response.interface';

describe('PaymentGateway', () => {
  let paymentGateway: PaymentGateway;
  let paymentClient: jest.Mocked<PaymentClientInterface>;

  beforeEach(() => {
    paymentClient = {
      createPaymentExternal: jest.fn(),
    } as any;

    paymentGateway = new PaymentGateway(paymentClient);
  });

  describe('createPayment', () => {
    it('should create payment successfully', async () => {
      const input: InputPayment = {
        email: 'customer@example.com',
        orderId: 'order-123',
        totalAmount: 100.0,
      };

      const mockResponse: PaymentExternallyResponse = {
        paymentId: 'payment-789',
        status: 'PENDING',
      };

      paymentClient.createPaymentExternal.mockResolvedValue(mockResponse);

      const result = await paymentGateway.createPayment(input);

      expect(result).toEqual(mockResponse);
      expect(paymentClient.createPaymentExternal).toHaveBeenCalledWith(input);
      expect(paymentClient.createPaymentExternal).toHaveBeenCalledTimes(1);
    });

    it('should call client with correct payment input', async () => {
      const input: InputPayment = {
        email: 'test@test.com',
        orderId: 'order-456',
        totalAmount: 250.5,
      };

      const mockResponse: PaymentExternallyResponse = {
        paymentId: 'payment-999',
        status: 'APPROVED',
      };

      paymentClient.createPaymentExternal.mockResolvedValue(mockResponse);

      await paymentGateway.createPayment(input);

      expect(paymentClient.createPaymentExternal).toHaveBeenCalledWith(input);
    });

    it('should return payment with PENDING status', async () => {
      const input: InputPayment = {
        email: 'user@example.com',
        orderId: 'order-789',
        totalAmount: 50.0,
      };

      paymentClient.createPaymentExternal.mockResolvedValue({
        paymentId: 'payment-123',
        status: 'PENDING',
      });

      const result = await paymentGateway.createPayment(input);

      expect(result.status).toBe('PENDING');
    });

    it('should handle different payment amounts', async () => {
      const input1: InputPayment = {
        email: 'user1@example.com',
        orderId: 'order-1',
        totalAmount: 10.0,
      };

      const input2: InputPayment = {
        email: 'user2@example.com',
        orderId: 'order-2',
        totalAmount: 1000.0,
      };

      paymentClient.createPaymentExternal.mockResolvedValueOnce({
        paymentId: 'payment-1',
        status: 'PENDING',
      });

      paymentClient.createPaymentExternal.mockResolvedValueOnce({
        paymentId: 'payment-2',
        status: 'PENDING',
      });

      const result1 = await paymentGateway.createPayment(input1);
      const result2 = await paymentGateway.createPayment(input2);

      expect(result1.paymentId).toBe('payment-1');
      expect(result2.paymentId).toBe('payment-2');
    });

    it('should pass through payment ID from client', async () => {
      const input: InputPayment = {
        email: 'customer@example.com',
        orderId: 'order-999',
        totalAmount: 75.5,
      };

      paymentClient.createPaymentExternal.mockResolvedValue({
        paymentId: 'specific-payment-id-123',
        status: 'APPROVED',
      });

      const result = await paymentGateway.createPayment(input);

      expect(result.paymentId).toBe('specific-payment-id-123');
    });
  });
});
