import { Test, TestingModule } from '@nestjs/testing';
import GetCustomerByCpf from './getCustomerByCpf.usecase';
import { CustomerGatewayInterface } from 'src/order/interfaces/gateways-interfaces/customer-gateway.interface';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { v4 as uuidv4 } from 'uuid';

describe('GetCustomerByCpf', () => {
  let getCustomerByCpf: GetCustomerByCpf;
  let customerGatewayMock: jest.Mocked<CustomerGatewayInterface>;

  beforeEach(async () => {
    customerGatewayMock = {
      findByCpf: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCustomerByCpf,
        {
          provide: 'CustomerGatewayInterface',
          useValue: customerGatewayMock,
        },
      ],
    }).compile();

    getCustomerByCpf = module.get<GetCustomerByCpf>(GetCustomerByCpf);
  });

  describe('getCustomerByCpf', () => {
    it('should return customer when found by CPF', async () => {
      const customerId = uuidv4();
      const cpf = '12345678901';
      const email = 'customer@example.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toEqual(mockCustomer);
      expect(result.id).toBe(customerId);
      expect(result.email).toBe(email);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith(cpf);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledTimes(1);
    });

    it('should throw BaseException when customer is not found', async () => {
      const cpf = '12345678901';

      customerGatewayMock.findByCpf.mockResolvedValue(null);

      await expect(getCustomerByCpf.getCustomerByCpf(cpf)).rejects.toThrow(
        BaseException,
      );
      await expect(getCustomerByCpf.getCustomerByCpf(cpf)).rejects.toThrow(
        `Customer with CPF ${cpf} not found`,
      );
    });

    it('should throw BaseException with correct status code 404', async () => {
      const cpf = '12345678901';

      customerGatewayMock.findByCpf.mockResolvedValue(null);

      try {
        await getCustomerByCpf.getCustomerByCpf(cpf);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).statusCode).toBe(404);
      }
    });

    it('should throw BaseException with error code CUSTOMER_NOT_FOUND', async () => {
      const cpf = '12345678901';

      customerGatewayMock.findByCpf.mockResolvedValue(null);

      try {
        await getCustomerByCpf.getCustomerByCpf(cpf);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('CUSTOMER_NOT_FOUND');
      }
    });

    it('should sanitize CPF by removing non-numeric characters', async () => {
      const customerId = uuidv4();
      const cpfFormatted = '123.456.789-01';
      const cpfClean = '12345678901';
      const email = 'test@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      await getCustomerByCpf.getCustomerByCpf(cpfFormatted);

      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith(cpfClean);
    });

    it('should handle CPF with dots and dashes', async () => {
      const customerId = uuidv4();
      const cpf = '111.222.333-44';
      const email = 'formatted@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toEqual(mockCustomer);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith('11122233344');
    });

    it('should return customer with valid UUID', async () => {
      const customerId = uuidv4();
      const cpf = '12345678901';
      const email = 'uuid@test.com';

      // Validate UUID format
      expect(customerId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result.id).toBe(customerId);
    });

    it('should call gateway with sanitized CPF', async () => {
      const customerId = uuidv4();
      const cpf = '000.111.222-33';
      const email = 'gateway@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith('00011122233');
    });

    it('should throw BaseException with invalid CPF length', async () => {
      const cpf = '123'; // CPF too short

      await expect(getCustomerByCpf.getCustomerByCpf(cpf)).rejects.toThrow(
        BaseException,
      );
    });

    it('should throw BaseException with invalid CPF error code', async () => {
      const cpf = '12345'; // Invalid length

      try {
        await getCustomerByCpf.getCustomerByCpf(cpf);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('INVALID_CPF');
      }
    });

    it('should throw BaseException with status 400 for invalid CPF', async () => {
      const cpf = '123456789'; // Invalid length

      try {
        await getCustomerByCpf.getCustomerByCpf(cpf);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).statusCode).toBe(400);
      }
    });

    it('should handle CPF with only numbers', async () => {
      const customerId = uuidv4();
      const cpf = '98765432101';
      const email = 'numbers@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toEqual(mockCustomer);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith(cpf);
    });

    it('should preserve email from customer response', async () => {
      const customerId = uuidv4();
      const cpf = '12345678901';
      const email = 'Test.User+Tag@Example.COM';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result.email).toBe(email);
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

      customerGatewayMock.findByCpf
        .mockResolvedValueOnce(mockCustomer1)
        .mockResolvedValueOnce(mockCustomer2);

      const result1 = await getCustomerByCpf.getCustomerByCpf(cpf1);
      const result2 = await getCustomerByCpf.getCustomerByCpf(cpf2);

      expect(result1.id).toBe(customerId1);
      expect(result2.id).toBe(customerId2);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledTimes(2);
    });

    it('should return customer data unchanged from gateway', async () => {
      const customerId = uuidv4();
      const cpf = '12345678901';
      const email = 'original@response.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toEqual(mockCustomer);
      expect(result).toBe(mockCustomer);
    });

    it('should handle gateway errors', async () => {
      const cpf = '12345678901';
      const error = new Error('Gateway connection error');

      customerGatewayMock.findByCpf.mockRejectedValue(error);

      await expect(getCustomerByCpf.getCustomerByCpf(cpf)).rejects.toThrow(
        'Gateway connection error',
      );
    });

    it('should throw error when CPF has more than 11 digits', async () => {
      const cpf = '123456789012'; // 12 digits

      await expect(getCustomerByCpf.getCustomerByCpf(cpf)).rejects.toThrow(
        BaseException,
      );
    });

    it('should handle CPF with special characters beyond dots and dashes', async () => {
      const customerId = uuidv4();
      const cpf = '123@456#789$01';
      const email = 'special@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toEqual(mockCustomer);
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith('12345678901');
    });

    it('should call Cpf.create to validate and sanitize CPF', async () => {
      const customerId = uuidv4();
      const cpf = '123.456.789-01';
      const email = 'validate@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      await getCustomerByCpf.getCustomerByCpf(cpf);

      // Verify that the CPF was sanitized (dots and dashes removed)
      expect(customerGatewayMock.findByCpf).toHaveBeenCalledWith('12345678901');
    });

    it('should return customer with both id and email properties', async () => {
      const customerId = uuidv4();
      const cpf = '12345678901';
      const email = 'complete@test.com';

      const mockCustomer: CustomerExternallyResponse = {
        id: customerId,
        email: email,
      };

      customerGatewayMock.findByCpf.mockResolvedValue(mockCustomer);

      const result = await getCustomerByCpf.getCustomerByCpf(cpf);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(Object.keys(result)).toHaveLength(2);
    });
  });
});
