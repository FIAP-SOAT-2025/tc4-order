import FindOrderByIdUseCase from './findOrder.usecase';
import Order from '../../../entities/order.entity';
import { OrderStatusEnum } from '../../../enums/orderStatus.enum';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import OrderGatewayInterface from '../../../interfaces/gateways-interfaces/oreder-gateways.interface';

const createMockOrder = (params: {
  id: string;
  status: OrderStatusEnum;
  customerId?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  orderItems: Array<{
    itemId: string;
    quantity: number;
    price: number;
  }>;
}): Order => {
  return Order.create({
    id: params.id,
    status: params.status,
    customerId: params.customerId,
    totalAmount: params.totalAmount,
    orderItems: params.orderItems,
    createdAt: params.createdAt,
    updatedAt: params.updatedAt,
  });
};

describe('FindOrderByIdUseCase', () => {
  let orderGatewayMock: jest.Mocked<OrderGatewayInterface>;

  beforeEach(() => {
    orderGatewayMock = {
      getOrderForId: jest.fn(),
      saveOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateStatusOrder: jest.fn(),
    };
  });

  describe('Feature: Search for order by ID', () => {
    describe('Scenario: Order found successfully', () => {
      it('Given a valid order exists in the system, When I search by ID, Then it should return the complete Order entity', async () => {
        const orderId = '123e4567-e89b-12d3-a456-426614174000';
        const mockOrder = createMockOrder({
          id: orderId,
          status: OrderStatusEnum.RECEIVED,
          customerId: 'customer-123',
          totalAmount: 50.0,
          createdAt: new Date('2025-11-30T10:00:00Z'),
          updatedAt: new Date('2025-11-30T10:00:00Z'),
          orderItems: [
            {
              itemId: 'item-1',
              quantity: 2,
              price: 25.0,
            },
          ],
        });

        orderGatewayMock.getOrderForId.mockResolvedValue(mockOrder);

        const result = await FindOrderByIdUseCase.findOrder(
          orderId,
          orderGatewayMock,
        );
        expect(result).toBeInstanceOf(Order);
        expect(result.id).toBe(orderId);
        expect(result.status).toBe(OrderStatusEnum.RECEIVED);
        expect(result.customerId).toBe('customer-123');
        expect(result.totalAmount).toBe(50.0);
        expect(result.orderItems).toHaveLength(1);

        expect(orderGatewayMock.getOrderForId).toHaveBeenCalledWith(orderId);
        expect(orderGatewayMock.getOrderForId).toHaveBeenCalledTimes(1);
      });
    });

    describe('Scenario: Order not found', () => {

      it('Given a non-existent ID, When I try to find the order, Then it should throw ORDER_NOT_FOUND exception', async () => {
        
        const nonExistentId = '999e9999-e99b-99d9-a999-999999999999';
        orderGatewayMock.getOrderForId.mockResolvedValue(null!);

        await expect(
          FindOrderByIdUseCase.findOrder(nonExistentId, orderGatewayMock),
        ).rejects.toThrow(BaseException);

        await expect(
          FindOrderByIdUseCase.findOrder(nonExistentId, orderGatewayMock),
        ).rejects.toThrow(`Order with id ${nonExistentId} not found`);

        expect(orderGatewayMock.getOrderForId).toHaveBeenCalledWith(
          nonExistentId,
        );
      });
    });

    describe('Scenario: Order with multiple items', () => {
      it('Given an order with multiple items, When I search by ID, Then all items should be present in the entity', async () => {
        const orderId = '456e7890-e89b-12d3-a456-426614174001';
        const mockOrder = createMockOrder({
          id: orderId,
          status: OrderStatusEnum.PREPARING,
          customerId: 'customer-456',
          totalAmount: 135.5,
          createdAt: new Date('2025-11-30T11:00:00Z'),
          updatedAt: new Date('2025-11-30T11:00:00Z'),
          orderItems: [
            {
              itemId: 'item-1',
              quantity: 2,
              price: 30.0,
            },
            {
              itemId: 'item-2',
              quantity: 1,
              price: 45.5,
            },
            {
              itemId: 'item-3',
              quantity: 3,
              price: 10.0,
            },
          ],
        });

        orderGatewayMock.getOrderForId.mockResolvedValue(mockOrder);

        const result = await FindOrderByIdUseCase.findOrder(
          orderId,
          orderGatewayMock,
        );

        expect(result.orderItems).toHaveLength(3);
        
        expect(result.totalAmount).toBe(135.5);
      });
    });

    describe('Scenario: Order without customer (anonymous)', () => {
      it('Given an order without customerId, When I search by ID, Then customerId should be undefined', async () => {
        const orderId = '1234e567-e89b-12d3-a456-426614174002';
        const mockOrder = createMockOrder({
          id: orderId,
          status: OrderStatusEnum.PENDING,
          customerId: undefined,
          totalAmount: 15.0,
          createdAt: new Date('2025-11-30T12:00:00Z'),
          updatedAt: new Date('2025-11-30T12:00:00Z'),
          orderItems: [
            {
              itemId: 'item-snack',
              quantity: 1,
              price: 15.0,
            },
          ],
        });

        orderGatewayMock.getOrderForId.mockResolvedValue(mockOrder);

        const result = await FindOrderByIdUseCase.findOrder(
          orderId,
          orderGatewayMock,
        );

        expect(result.customerId).toBeUndefined();
        expect(result.id).toBe(orderId);
        expect(result.status).toBe(OrderStatusEnum.PENDING);
      });
    });

    describe('Scenario: Different order statuses', () => {
      const testCases = [
        { status: OrderStatusEnum.PENDING, description: 'PENDING' },
        { status: OrderStatusEnum.RECEIVED, description: 'RECEIVED' },
        { status: OrderStatusEnum.PREPARING, description: 'PREPARING' },
        { status: OrderStatusEnum.READY, description: 'READY' },
        { status: OrderStatusEnum.COMPLETED, description: 'COMPLETED' },
        { status: OrderStatusEnum.CANCELLED, description: 'CANCELLED' },
      ];

      testCases.forEach(({ status, description }) => {
        it(`Given an order with status ${description}, When I search by ID, Then the status should be preserved`, async () => {
          
          const orderId = `order-${description}`;
          const mockOrder = createMockOrder({
            id: orderId,
            status: status,
            customerId: 'customer-test',
            totalAmount: 10.0,
            createdAt: new Date(),
            updatedAt: new Date(),
            orderItems: [
              {
                itemId: 'item-test',
                quantity: 1,
                price: 10.0,
              },
            ],
          });

          orderGatewayMock.getOrderForId.mockResolvedValue(mockOrder);

          const result = await FindOrderByIdUseCase.findOrder(
            orderId,
            orderGatewayMock,
          );

          expect(result.status).toBe(status);
        });
      });
    });

    describe('Scenario: Gateway returns invalid data', () => {
      it('Given the gateway returns null, When I search by ID, Then it should throw an exception', async () => {
        const orderId = 'invalid-order-id';
        orderGatewayMock.getOrderForId.mockResolvedValue(null!);

        await expect(
          FindOrderByIdUseCase.findOrder(orderId, orderGatewayMock),
        ).rejects.toThrow(BaseException);
      });

      it('Given the gateway returns undefined, When I search by ID, Then it should throw an exception', async () => {

        const orderId = 'invalid-order-id';
        orderGatewayMock.getOrderForId.mockResolvedValue(undefined!);

        await expect(
          FindOrderByIdUseCase.findOrder(orderId, orderGatewayMock),
        ).rejects.toThrow(BaseException);
      });
    });
  });
});
