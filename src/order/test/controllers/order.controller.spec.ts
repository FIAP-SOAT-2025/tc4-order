/* eslint-disable prettier/prettier */
import { OrderController } from '../../controllers/order.controller';
import ProcessOrderUseCase from '../../usecases/createOrder.usecase';
import { OrderDto } from '../../infraestructure/api/dto/order.dto';
import OrderRepositoryInterface from '../../interfaces/OrderRepository.interface';
import { GetCustomerByCpfInterface } from '../../interfaces/get-customer-by-cpf-Interface';
import { ItemGatewayInterface } from '../../interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentGatewayInterface } from '../../interfaces/gateways-interfaces/payment-gateway.interface';
import OrderInterface from '../../interfaces/order.interface';
import { PaymentExternallyResponse } from '../../interfaces/responses-interfaces/payment-response.interface';

jest.mock('../../usecases/createOrder.usecase');

describe('OrderController', () => {
  let orderRepository: jest.Mocked<OrderRepositoryInterface>;
  let getCustomerByCpf: jest.Mocked<GetCustomerByCpfInterface>;
  let itemGateway: jest.Mocked<ItemGatewayInterface>;
  let paymentGateway: jest.Mocked<PaymentGatewayInterface>;

  beforeEach(() => {
    jest.clearAllMocks();

    orderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    } as any;

    getCustomerByCpf = {
      getCustomerByCpf: jest.fn(),
    } as any;

    itemGateway = {
      findItemsByIds: jest.fn(),
    } as any;

    paymentGateway = {
      createPayment: jest.fn(),
    } as any;
  });

  describe('createOrder', () => {
    it('should create an order successfully and return order with payment', async () => {
      const createOrderDto: OrderDto = {
        customerCpf: '12345678900',
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 2,
          },
          {
            itemId: 'item-2',
            itemQuantity: 1,
          },
        ],
      };

      const mockOrder: OrderInterface = {
        id: 'order-123',
        customerId: 'customer-456',
        status: 'PENDING',
        totalAmount: 100.0,
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 2,
            price: 30.0,
          },
          {
            itemId: 'item-2',
            itemQuantity: 1,
            price: 40.0,
          },
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockPayment: PaymentExternallyResponse = {
        paymentId: 'payment-789',
        status: 'PENDING',
      };

      const mockResponse = {
        order: mockOrder,
        payment: mockPayment,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      const result = await OrderController.createOrder(
        createOrderDto,
        orderRepository,
        getCustomerByCpf,
        itemGateway,
        paymentGateway,
      );

      expect(result).toEqual(mockResponse);
      expect(result.order).toEqual(mockOrder);
      expect(result.payment).toEqual(mockPayment);
      expect(ProcessOrderUseCase.processOrder).toHaveBeenCalledTimes(1);
      expect(ProcessOrderUseCase.processOrder).toHaveBeenCalledWith(
        createOrderDto,
        expect.any(Object), // OrderGateway instance
        getCustomerByCpf,
        expect.any(Object), // CreatePaymentUseCase instance
        itemGateway,
      );
    });

    it('should create an order without customerCpf', async () => {
      const createOrderDto: OrderDto = {
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 1,
          },
        ],
      };

      const mockOrder: OrderInterface = {
        id: 'order-123',
        status: 'PENDING',
        totalAmount: 50.0,
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 1,
            price: 50.0,
          },
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const mockPayment: PaymentExternallyResponse = {
        paymentId: 'payment-789',
        status: 'PENDING',
      };

      const mockResponse = {
        order: mockOrder,
        payment: mockPayment,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      const result = await OrderController.createOrder(
        createOrderDto,
        orderRepository,
        getCustomerByCpf,
        itemGateway,
        paymentGateway,
      );

      expect(result).toEqual(mockResponse);
      expect(result.order.customerId).toBeUndefined();
    });

    it('should throw an error when ProcessOrderUseCase fails', async () => {
      const createOrderDto: OrderDto = {
        customerCpf: '12345678900',
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 2,
          },
        ],
      };

      const errorMessage = 'Failed to process order';
      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockRejectedValue(new Error(errorMessage));

      await expect(
        OrderController.createOrder(
          createOrderDto,
          orderRepository,
          getCustomerByCpf,
          itemGateway,
          paymentGateway,
        ),
      ).rejects.toThrow(`Failed to create order  - ${JSON.stringify(new Error(errorMessage))}`);

      expect(ProcessOrderUseCase.processOrder).toHaveBeenCalledTimes(1);
    });

    it('should throw an error with proper error message formatting', async () => {
      const createOrderDto: OrderDto = {
        orderItems: [
          {
            itemId: 'item-1',
            itemQuantity: 2,
          },
        ],
      };

      const customError = {
        message: 'Item not found',
        code: 'ITEM_NOT_FOUND',
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockRejectedValue(customError);

      await expect(
        OrderController.createOrder(
          createOrderDto,
          orderRepository,
          getCustomerByCpf,
          itemGateway,
          paymentGateway,
        ),
      ).rejects.toThrow(`Failed to create order  - ${JSON.stringify(customError)}`);
    });

    it('should call ProcessOrderUseCase with correct parameters', async () => {
      const createOrderDto: OrderDto = {
        customerCpf: '98765432100',
        orderItems: [
          {
            itemId: 'item-3',
            itemQuantity: 5,
          },
        ],
      };

      const mockResponse = {
        order: {
          id: 'order-999',
          status: 'PENDING',
          totalAmount: 250.0,
          orderItems: [],
        } as OrderInterface,
        payment: {
          paymentId: 'payment-999',
          status: 'PENDING',
        } as PaymentExternallyResponse,
      };

      jest.spyOn(ProcessOrderUseCase, 'processOrder').mockResolvedValue(mockResponse);

      await OrderController.createOrder(
        createOrderDto,
        orderRepository,
        getCustomerByCpf,
        itemGateway,
        paymentGateway,
      );

      const processOrderCall = (ProcessOrderUseCase.processOrder as jest.Mock).mock.calls[0];

      expect(processOrderCall[0]).toEqual(createOrderDto);
      expect(processOrderCall[1]).toBeDefined(); // OrderGateway
      expect(processOrderCall[1].constructor.name).toBe('OrderGateway');
      expect(processOrderCall[2]).toEqual(getCustomerByCpf);
      expect(processOrderCall[3]).toBeDefined(); // CreatePaymentUseCase
      expect(processOrderCall[3].constructor.name).toBe('CreatePaymentUseCase');
      expect(processOrderCall[4]).toEqual(itemGateway);
    });
  });
});
