/* eslint-disable prettier/prettier */
import { CustomerGateway } from '../../gateways/customer.gateway';
import { CustomerClientInterface } from '../../interfaces/clients-interfaces/customer-client.interface';
import { CustomerExternallyResponse } from '../../interfaces/responses-interfaces/customer-externally-response.interface';

describe('CustomerGateway', () => {
  let customerGateway: CustomerGateway;
  let customerClient: jest.Mocked<CustomerClientInterface>;

  beforeEach(() => {
    customerClient = {
      findByCpfExternally: jest.fn(),
    } as any;

    customerGateway = new CustomerGateway(customerClient);
  });

  describe('findByCpf', () => {
    it('should return customer when found', async () => {
      const mockCustomer: CustomerExternallyResponse = {
        id: 'customer-123',
        email: 'customer@example.com',
      };

      customerClient.findByCpfExternally.mockResolvedValue(mockCustomer);

      const result = await customerGateway.findByCpf('12345678900');

      expect(result).toEqual(mockCustomer);
      expect(customerClient.findByCpfExternally).toHaveBeenCalledWith('12345678900');
      expect(customerClient.findByCpfExternally).toHaveBeenCalledTimes(1);
    });

    it('should return null when customer not found', async () => {
      customerClient.findByCpfExternally.mockResolvedValue(null);

      const result = await customerGateway.findByCpf('99999999999');

      expect(result).toBeNull();
      expect(customerClient.findByCpfExternally).toHaveBeenCalledWith('99999999999');
    });

    it('should format customer data correctly', async () => {
      const externalCustomer: CustomerExternallyResponse = {
        id: 'customer-456',
        email: 'test@test.com',
      };

      customerClient.findByCpfExternally.mockResolvedValue(externalCustomer);

      const result = await customerGateway.findByCpf('12345678900');

      expect(result).toEqual({
        id: 'customer-456',
        email: 'test@test.com',
      });
    });

    it('should throw error when client fails', async () => {
      const error = new Error('External service error');
      customerClient.findByCpfExternally.mockRejectedValue(error);

      await expect(
        customerGateway.findByCpf('12345678900'),
      ).rejects.toThrow('Failed to fetch customer by CPF');
    });

    it('should call client with correct CPF', async () => {
      const cpf = '11122233344';
      customerClient.findByCpfExternally.mockResolvedValue({
        id: 'customer-789',
        email: 'user@example.com',
      });

      await customerGateway.findByCpf(cpf);

      expect(customerClient.findByCpfExternally).toHaveBeenCalledWith(cpf);
    });
  });
});
