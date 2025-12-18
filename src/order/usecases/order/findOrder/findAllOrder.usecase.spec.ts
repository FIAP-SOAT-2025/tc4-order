import FindAllOrderUseCase from './findAllOrder.usecase';
import Order from '../../../entities/order.entity';
import { OrderStatusEnum } from '../../../enums/orderStatus.enum';
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

describe('FindAllOrderUseCase', () => {
  let orderGatewayMock: jest.Mocked<OrderGatewayInterface>;

  beforeEach(() => {
    orderGatewayMock = {
      getOrderForId: jest.fn(),
      saveOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateStatusOrder: jest.fn(),
    };
  });

  describe('Feature: Retrieve all orders', () => {
    describe('Scenario: Multiple orders exist in the system', () => {
      it('Given multiple orders exist, When I request all orders, Then it should return an array with all orders', async () => {
        const mockOrders = [
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174001',
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
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174002',
            status: OrderStatusEnum.PREPARING,
            customerId: 'customer-456',
            totalAmount: 75.5,
            createdAt: new Date('2025-11-30T11:00:00Z'),
            updatedAt: new Date('2025-11-30T11:30:00Z'),
            orderItems: [
              {
                itemId: 'item-2',
                quantity: 1,
                price: 75.5,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174003',
            status: OrderStatusEnum.READY,
            customerId: 'customer-789',
            totalAmount: 100.0,
            createdAt: new Date('2025-11-30T12:00:00Z'),
            updatedAt: new Date('2025-11-30T12:45:00Z'),
            orderItems: [
              {
                itemId: 'item-3',
                quantity: 4,
                price: 25.0,
              },
            ],
          }),
        ];

        orderGatewayMock.getAllOrders.mockResolvedValue(mockOrders);

        const result = await FindAllOrderUseCase.findAll(orderGatewayMock);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(3);
        expect(result[0]).toBeInstanceOf(Order);
        expect(result[1]).toBeInstanceOf(Order);
        expect(result[2]).toBeInstanceOf(Order);

        expect(result[0].id).toBe('123e4567-e89b-12d3-a456-426614174001');
        expect(result[0].status).toBe(OrderStatusEnum.RECEIVED);
        expect(result[0].totalAmount).toBe(50.0);

        expect(result[1].id).toBe('123e4567-e89b-12d3-a456-426614174002');
        expect(result[1].status).toBe(OrderStatusEnum.PREPARING);
        expect(result[1].totalAmount).toBe(75.5);

        expect(result[2].id).toBe('123e4567-e89b-12d3-a456-426614174003');
        expect(result[2].status).toBe(OrderStatusEnum.READY);
        expect(result[2].totalAmount).toBe(100.0);

        expect(orderGatewayMock.getAllOrders).toHaveBeenCalledTimes(1);
      });

      it('Given orders with different statuses exist, When I request all orders, Then it should return orders with all statuses', async () => {
        const mockOrders = [
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174001',
            status: OrderStatusEnum.PENDING,
            totalAmount: 30.0,
            createdAt: new Date('2025-11-30T10:00:00Z'),
            orderItems: [
              {
                itemId: 'item-1',
                quantity: 1,
                price: 30.0,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174002',
            status: OrderStatusEnum.RECEIVED,
            totalAmount: 40.0,
            createdAt: new Date('2025-11-30T11:00:00Z'),
            orderItems: [
              {
                itemId: 'item-2',
                quantity: 1,
                price: 40.0,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174003',
            status: OrderStatusEnum.PREPARING,
            totalAmount: 50.0,
            createdAt: new Date('2025-11-30T12:00:00Z'),
            orderItems: [
              {
                itemId: 'item-3',
                quantity: 1,
                price: 50.0,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174004',
            status: OrderStatusEnum.READY,
            totalAmount: 60.0,
            createdAt: new Date('2025-11-30T13:00:00Z'),
            orderItems: [
              {
                itemId: 'item-4',
                quantity: 1,
                price: 60.0,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174005',
            status: OrderStatusEnum.COMPLETED,
            totalAmount: 70.0,
            createdAt: new Date('2025-11-30T14:00:00Z'),
            orderItems: [
              {
                itemId: 'item-5',
                quantity: 1,
                price: 70.0,
              },
            ],
          }),
        ];

        orderGatewayMock.getAllOrders.mockResolvedValue(mockOrders);

        const result = await FindAllOrderUseCase.findAll(orderGatewayMock);

        expect(result).toHaveLength(5);
        expect(result[0].status).toBe(OrderStatusEnum.PENDING);
        expect(result[1].status).toBe(OrderStatusEnum.RECEIVED);
        expect(result[2].status).toBe(OrderStatusEnum.PREPARING);
        expect(result[3].status).toBe(OrderStatusEnum.READY);
        expect(result[4].status).toBe(OrderStatusEnum.COMPLETED);

        expect(orderGatewayMock.getAllOrders).toHaveBeenCalledTimes(1);
      });
    });

    describe('Scenario: Single order exists in the system', () => {
      it('Given only one order exists, When I request all orders, Then it should return an array with one order', async () => {
        const mockOrders = [
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174001',
            status: OrderStatusEnum.RECEIVED,
            customerId: 'customer-123',
            totalAmount: 50.0,
            createdAt: new Date('2025-11-30T10:00:00Z'),
            orderItems: [
              {
                itemId: 'item-1',
                quantity: 2,
                price: 25.0,
              },
            ],
          }),
        ];

        orderGatewayMock.getAllOrders.mockResolvedValue(mockOrders);

        const result = await FindAllOrderUseCase.findAll(orderGatewayMock);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Order);
        expect(result[0].id).toBe('123e4567-e89b-12d3-a456-426614174001');
        expect(result[0].status).toBe(OrderStatusEnum.RECEIVED);
        expect(result[0].customerId).toBe('customer-123');
        expect(result[0].totalAmount).toBe(50.0);
        expect(result[0].orderItems).toHaveLength(1);

        expect(orderGatewayMock.getAllOrders).toHaveBeenCalledTimes(1);
      });
    });

    describe('Scenario: Orders with and without customer ID', () => {
      it('Given orders with and without customer ID exist, When I request all orders, Then it should return all orders correctly', async () => {
        const mockOrders = [
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174001',
            status: OrderStatusEnum.RECEIVED,
            customerId: 'customer-123',
            totalAmount: 50.0,
            createdAt: new Date('2025-11-30T10:00:00Z'),
            orderItems: [
              {
                itemId: 'item-1',
                quantity: 2,
                price: 25.0,
              },
            ],
          }),
          createMockOrder({
            id: '123e4567-e89b-12d3-a456-426614174002',
            status: OrderStatusEnum.PREPARING,
            customerId: undefined,
            totalAmount: 75.5,
            createdAt: new Date('2025-11-30T11:00:00Z'),
            orderItems: [
              {
                itemId: 'item-2',
                quantity: 1,
                price: 75.5,
              },
            ],
          }),
        ];

        orderGatewayMock.getAllOrders.mockResolvedValue(mockOrders);

        const result = await FindAllOrderUseCase.findAll(orderGatewayMock);

        expect(result).toHaveLength(2);
        expect(result[0].customerId).toBe('customer-123');
        expect(result[1].customerId).toBeUndefined();

        expect(orderGatewayMock.getAllOrders).toHaveBeenCalledTimes(1);
      });
    });
  });
});
