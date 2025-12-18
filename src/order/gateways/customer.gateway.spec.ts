import { CustomerGateway } from './customer.gateway';
import { CustomerClientInterface } from '../interfaces/clients-interfaces/customer-client.interface';
import { CustomerExternallyResponse } from '../interfaces/responses-interfaces/customer-externally-response.interface';
import { v4 as uuidv4 } from 'uuid';

describe('CustomerGateway', () => {
  let customerGateway: CustomerGateway;
  let customerClientMock: jest.Mocked<CustomerClientInterface>;

  beforeEach(() => {
    customerClientMock = {
      findByCpfExternally: jest.fn(),
    };

    customerGateway = new CustomerGateway(customerClientMock);
  });

  describe('constructor', () => {
    it('should instantiate CustomerGateway with customerClient', () => {
      expect(customerGateway).toBeDefined();
      expect(customerGateway['customerClient']).toBe(customerClientMock);
    });
  });

  describe('findByCpf', () => {
    it('should return customer when found by CPF', async () => {
      const customerId = uuidv4();
      const cpf = '12345678900';
      const email = 'customer@example.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toEqual({
        id: customerId,
        email: email,
      });
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledWith(cpf);
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledTimes(1);
    });

    it('should return null when customer is not found', async () => {
      const cpf = '99999999999';

      customerClientMock.findByCpfExternally.mockResolvedValue(null);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toBeNull();
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledWith(cpf);
    });

    it('should return customer with correct id and email mapping', async () => {
      const customerId = uuidv4();
      const cpf = '11122233344';
      const email = 'test@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(customerId);
      expect(result?.email).toBe(email);
    });

    it('should call findByCpfExternally with correct CPF parameter', async () => {
      const cpf = '55566677788';
      const customerId = uuidv4();

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: 'user@domain.com',
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      await customerGateway.findByCpf(cpf);

      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledWith(cpf);
    });

    it('should throw error when customerClient throws error', async () => {
      const cpf = '12345678900';
      const error = new Error('External service error');

      customerClientMock.findByCpfExternally.mockRejectedValue(error);

      await expect(customerGateway.findByCpf(cpf)).rejects.toThrow(
        'Failed to fetch customer by CPF',
      );
    });

    it('should throw error with error details when client fails', async () => {
      const cpf = '12345678900';
      const errorMessage = 'Service unavailable';
      const error = new Error(errorMessage);

      customerClientMock.findByCpfExternally.mockRejectedValue(error);

      await expect(customerGateway.findByCpf(cpf)).rejects.toThrow(
        `Failed to fetch customer by CPF - ${JSON.stringify(error)}`,
      );
    });

    it('should handle different CPF formats', async () => {
      const customerId = uuidv4();
      const cpf = '000.111.222-33';
      const email = 'formatted@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toEqual({
        id: customerId,
        email: email,
      });
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledWith(cpf);
    });

    it('should return customer with valid UUID as id', async () => {
      const customerId = uuidv4();
      const cpf = '12312312312';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: 'uuid@test.com',
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result?.id).toBe(customerId);
      expect(result?.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should handle multiple sequential calls', async () => {
      const customerId1 = uuidv4();
      const customerId2 = uuidv4();
      const cpf1 = '11111111111';
      const cpf2 = '22222222222';

      const mockCustomer1: CustomerExternallyResponse = {
        id: customerId1,
        email: 'customer1@test.com',
      };

      const mockCustomer2: CustomerExternallyResponse = {
        id: customerId2,
        email: 'customer2@test.com',
      };

      customerClientMock.findByCpfExternally
        .mockResolvedValueOnce(mockCustomer1)
        .mockResolvedValueOnce(mockCustomer2);

      const result1 = await customerGateway.findByCpf(cpf1);
      const result2 = await customerGateway.findByCpf(cpf2);

      expect(result1?.id).toBe(customerId1);
      expect(result2?.id).toBe(customerId2);
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledTimes(2);
    });

    it('should return only id and email properties', async () => {
      const customerId = uuidv4();
      const cpf = '12345678900';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: 'simple@test.com',
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toEqual({
        id: customerId,
        email: 'simple@test.com',
      });
      expect(Object.keys(result!)).toHaveLength(2);
      expect(Object.keys(result!)).toContain('id');
      expect(Object.keys(result!)).toContain('email');
    });

    it('should handle network errors', async () => {
      const cpf = '12345678900';
      const networkError = { message: 'Network timeout', code: 'ETIMEDOUT' };

      customerClientMock.findByCpfExternally.mockRejectedValue(networkError);

      await expect(customerGateway.findByCpf(cpf)).rejects.toThrow(
        'Failed to fetch customer by CPF',
      );
    });

    it('should handle empty CPF string', async () => {
      const cpf = '';
      const customerId = uuidv4();

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: 'empty@test.com',
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toEqual({
        id: customerId,
        email: 'empty@test.com',
      });
      expect(customerClientMock.findByCpfExternally).toHaveBeenCalledWith('');
    });

    it('should preserve email format from external service', async () => {
      const customerId = uuidv4();
      const cpf = '12345678900';
      const email = 'Test.User+Tag@Example.COM';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result?.email).toBe(email);
    });

    it('should handle API errors with structured error objects', async () => {
      const cpf = '12345678900';
      const apiError = {
        status: 500,
        message: 'Internal Server Error',
        details: 'Database connection failed',
      };

      customerClientMock.findByCpfExternally.mockRejectedValue(apiError);

      await expect(customerGateway.findByCpf(cpf)).rejects.toThrow(
        `Failed to fetch customer by CPF - ${JSON.stringify(apiError)}`,
      );
    });

    it('should return customer data unchanged from client response', async () => {
      const customerId = uuidv4();
      const cpf = '98765432100';
      const email = 'original@response.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerClientMock.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf(cpf);

      expect(result).toEqual(mockCustomer);
    });
  });
});
