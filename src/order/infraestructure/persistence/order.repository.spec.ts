import { Test, TestingModule } from '@nestjs/testing';
import { PrismaOrderRepository } from './order.repository';
import { PrismaService } from 'src/shared/infra/prisma.service';
import Order from 'src/order/entities/order.entity';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '@prisma/client/runtime/library';

describe('PrismaOrderRepository', () => {
  let repository: PrismaOrderRepository;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      order: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      orderItem: {
        createManyAndReturn: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrderRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaOrderRepository>(PrismaOrderRepository);
    prismaService = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create order successfully with customer', async () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        customerId: customerId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 2, price: 25.0 }],
      });

      const mockCreatedOrder = {
        id: orderId,
        customerId: customerId,
        status: 'PENDING',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedItems = [
        {
          itemId: itemId,
          orderId: orderId,
          quantity: 2,
          price: new Decimal(25.0),
        },
      ];

      prismaService.order.create.mockResolvedValue(mockCreatedOrder);
      prismaService.orderItem.createManyAndReturn.mockResolvedValue(
        mockCreatedItems,
      );

      const result = await repository.create(order);

      expect(result).toBeDefined();
      expect(result.id).toBe(orderId);
      expect(result.customerId).toBe(customerId);
      expect(result.status).toBe(OrderStatusEnum.PENDING);
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          id: orderId,
          status: OrderStatusEnum.PENDING,
          customerId: customerId,
          totalAmount: 50.0,
        },
      });
      expect(prismaService.orderItem.createManyAndReturn).toHaveBeenCalledWith({
        data: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 2,
            price: 25.0,
          },
        ],
        skipDuplicates: true,
      });
    });

    it('should create order successfully without customer', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      const mockCreatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PENDING',
        totalAmount: new Decimal(100.0),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedItems = [
        {
          itemId: itemId,
          orderId: orderId,
          quantity: 1,
          price: new Decimal(100.0),
        },
      ];

      prismaService.order.create.mockResolvedValue(mockCreatedOrder);
      prismaService.orderItem.createManyAndReturn.mockResolvedValue(
        mockCreatedItems,
      );

      const result = await repository.create(order);

      expect(result.id).toBe(orderId);
      expect(result.customerId).toBeUndefined();
      expect(prismaService.order.create).toHaveBeenCalledWith({
        data: {
          id: orderId,
          status: OrderStatusEnum.PENDING,
          customerId: undefined,
          totalAmount: 100.0,
        },
      });
    });

    it('should create order with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
          { itemId: itemId3, quantity: 3, price: 10.0 },
        ],
      });

      const mockCreatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PENDING',
        totalAmount: new Decimal(130.0),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedItems = [
        {
          itemId: itemId1,
          orderId: orderId,
          quantity: 2,
          price: new Decimal(25.0),
        },
        {
          itemId: itemId2,
          orderId: orderId,
          quantity: 1,
          price: new Decimal(50.0),
        },
        {
          itemId: itemId3,
          orderId: orderId,
          quantity: 3,
          price: new Decimal(10.0),
        },
      ];

      prismaService.order.create.mockResolvedValue(mockCreatedOrder);
      prismaService.orderItem.createManyAndReturn.mockResolvedValue(
        mockCreatedItems,
      );

      const result = await repository.create(order);

      expect(result.orderItems).toHaveLength(3);
      expect(prismaService.orderItem.createManyAndReturn).toHaveBeenCalledWith({
        data: [
          { itemId: itemId1, orderId: orderId, quantity: 2, price: 25.0 },
          { itemId: itemId2, orderId: orderId, quantity: 1, price: 50.0 },
          { itemId: itemId3, orderId: orderId, quantity: 3, price: 10.0 },
        ],
        skipDuplicates: true,
      });
    });

    it('should throw error when order creation fails', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      prismaService.order.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.create(order)).rejects.toThrow(
        'Failed to create order',
      );
    });

    it('should throw error when order items creation fails', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      const mockCreatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PENDING',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.order.create.mockResolvedValue(mockCreatedOrder);
      prismaService.orderItem.createManyAndReturn.mockRejectedValue(
        new Error('Failed to create items'),
      );

      await expect(repository.create(order)).rejects.toThrow(
        'Failed to create order',
      );
    });

    it('should call createManyAndReturn with skipDuplicates true', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const order = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const mockCreatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PENDING',
        totalAmount: new Decimal(25.0),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCreatedItems = [
        {
          itemId: itemId,
          orderId: orderId,
          quantity: 1,
          price: new Decimal(25.0),
        },
      ];

      prismaService.order.create.mockResolvedValue(mockCreatedOrder);
      prismaService.orderItem.createManyAndReturn.mockResolvedValue(
        mockCreatedItems,
      );

      await repository.create(order);

      expect(prismaService.orderItem.createManyAndReturn).toHaveBeenCalledWith(
        expect.objectContaining({
          skipDuplicates: true,
        }),
      );
    });
  });

  describe('findById', () => {
    it('should find order by id successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const customerId = uuidv4();

      const mockPrismaOrder = {
        id: orderId,
        customerId: customerId,
        status: 'PENDING',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 2,
            price: new Decimal(25.0),
          },
        ],
      };

      prismaService.order.findUnique.mockResolvedValue(mockPrismaOrder);

      const result = await repository.findById(orderId);

      expect(result).toBeDefined();
      expect(result.id).toBe(orderId);
      expect(result.customerId).toBe(customerId);
      expect(result.orderItems).toHaveLength(1);
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: orderId },
        include: { orderItems: true },
      });
    });

    it('should throw NotFoundException when order is not found', async () => {
      const orderId = uuidv4();

      prismaService.order.findUnique.mockResolvedValue(null);

      await expect(repository.findById(orderId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(repository.findById(orderId)).rejects.toThrow(
        'Order not found in repository',
      );
    });

    it('should find order without customer', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockPrismaOrder = {
        id: orderId,
        customerId: null,
        status: 'PENDING',
        totalAmount: new Decimal(100.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(100.0),
          },
        ],
      };

      prismaService.order.findUnique.mockResolvedValue(mockPrismaOrder);

      const result = await repository.findById(orderId);

      expect(result.customerId).toBeUndefined();
    });

    it('should find order with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockPrismaOrder = {
        id: orderId,
        customerId: null,
        status: 'RECEIVED',
        totalAmount: new Decimal(150.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId1,
            orderId: orderId,
            quantity: 2,
            price: new Decimal(50.0),
          },
          {
            itemId: itemId2,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.findUnique.mockResolvedValue(mockPrismaOrder);

      const result = await repository.findById(orderId);

      expect(result.orderItems).toHaveLength(2);
      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should include orderItems in query', async () => {
      const orderId = uuidv4();

      prismaService.order.findUnique.mockResolvedValue(null);

      try {
        await repository.findById(orderId);
      } catch (error) {
        // Expected to throw
      }

      expect(prismaService.order.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { orderItems: true },
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should find all orders successfully', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockRawResults = [
        {
          id: orderId1,
          status: 'READY',
          totalAmount: new Decimal(50.0),
          createdAt: new Date(),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId1,
              orderId: orderId1,
              quantity: 2,
              price: new Decimal(25.0),
            },
          ],
        },
        {
          id: orderId2,
          status: 'PREPARING',
          totalAmount: new Decimal(100.0),
          createdAt: new Date(),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId2,
              orderId: orderId2,
              quantity: 1,
              price: new Decimal(100.0),
            },
          ],
        },
      ];

      prismaService.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe(OrderStatusEnum.READY);
      expect(result[1].status).toBe(OrderStatusEnum.PREPARING);
      expect(prismaService.$queryRaw).toHaveBeenCalled();
    });

    it('should return empty array when no orders exist', async () => {
      prismaService.$queryRaw.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should find orders with READY, PREPARING, and RECEIVED statuses', async () => {
      const orderId1 = uuidv4();
      const orderId2 = uuidv4();
      const orderId3 = uuidv4();
      const itemId = uuidv4();

      const mockRawResults = [
        {
          id: orderId1,
          status: 'READY',
          totalAmount: new Decimal(50.0),
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId,
              orderId: orderId1,
              quantity: 1,
              price: new Decimal(50.0),
            },
          ],
        },
        {
          id: orderId2,
          status: 'PREPARING',
          totalAmount: new Decimal(75.0),
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId,
              orderId: orderId2,
              quantity: 1,
              price: new Decimal(75.0),
            },
          ],
        },
        {
          id: orderId3,
          status: 'RECEIVED',
          totalAmount: new Decimal(100.0),
          createdAt: new Date('2025-01-03'),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId,
              orderId: orderId3,
              quantity: 1,
              price: new Decimal(100.0),
            },
          ],
        },
      ];

      prismaService.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(3);
      const statuses = result.map((order) => order.status);
      expect(statuses).toContain(OrderStatusEnum.READY);
      expect(statuses).toContain(OrderStatusEnum.PREPARING);
      expect(statuses).toContain(OrderStatusEnum.RECEIVED);
    });

    it('should handle orders with multiple items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const mockRawResults = [
        {
          id: orderId,
          status: 'READY',
          totalAmount: new Decimal(150.0),
          createdAt: new Date(),
          updatedAt: new Date(),
          customerId: null,
          items: [
            {
              itemId: itemId1,
              orderId: orderId,
              quantity: 2,
              price: new Decimal(25.0),
            },
            {
              itemId: itemId2,
              orderId: orderId,
              quantity: 1,
              price: new Decimal(50.0),
            },
            {
              itemId: itemId3,
              orderId: orderId,
              quantity: 5,
              price: new Decimal(10.0),
            },
          ],
        },
      ];

      prismaService.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].orderItems).toHaveLength(3);
    });

    it('should throw error when query fails', async () => {
      prismaService.$queryRaw.mockRejectedValue(new Error('Database error'));

      await expect(repository.findAll()).rejects.toThrow(
        'Failed to find orders',
      );
    });

    it('should handle orders with customer id', async () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const mockRawResults = [
        {
          id: orderId,
          status: 'READY',
          totalAmount: new Decimal(50.0),
          createdAt: new Date(),
          updatedAt: new Date(),
          customerId: customerId,
          items: [
            {
              itemId: itemId,
              orderId: orderId,
              quantity: 1,
              price: new Decimal(50.0),
            },
          ],
        },
      ];

      prismaService.$queryRaw.mockResolvedValue(mockRawResults);

      const result = await repository.findAll();

      expect(result[0].customerId).toBe(customerId);
    });
  });

  describe('updateStatus', () => {
    it('should update order status successfully', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'RECEIVED',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 2,
            price: new Decimal(25.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result.id).toBe(orderId);
      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
      expect(prismaService.order.update).toHaveBeenCalledWith({
        where: { id: orderId },
        data: { status: OrderStatusEnum.RECEIVED },
        include: { orderItems: true },
      });
    });

    it('should update status from PENDING to RECEIVED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'RECEIVED',
        totalAmount: new Decimal(100.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(100.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result.status).toBe(OrderStatusEnum.RECEIVED);
    });

    it('should update status to PREPARING', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PREPARING',
        totalAmount: new Decimal(75.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(75.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.PREPARING,
      );

      expect(result.status).toBe(OrderStatusEnum.PREPARING);
    });

    it('should update status to READY', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'READY',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.READY,
      );

      expect(result.status).toBe(OrderStatusEnum.READY);
    });

    it('should update status to COMPLETED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'COMPLETED',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.COMPLETED,
      );

      expect(result.status).toBe(OrderStatusEnum.COMPLETED);
    });

    it('should throw error when update fails', async () => {
      const orderId = uuidv4();

      prismaService.order.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        repository.updateStatus(orderId, OrderStatusEnum.RECEIVED),
      ).rejects.toThrow(`Failed to update order status for ${orderId}`);
    });

    it('should include orderItems in update query', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'RECEIVED',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      await repository.updateStatus(orderId, OrderStatusEnum.RECEIVED);

      expect(prismaService.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { orderItems: true },
        }),
      );
    });

    it('should return order with updated status and items', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: null,
        status: 'PREPARING',
        totalAmount: new Decimal(150.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId1,
            orderId: orderId,
            quantity: 2,
            price: new Decimal(50.0),
          },
          {
            itemId: itemId2,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.PREPARING,
      );

      expect(result.orderItems).toHaveLength(2);
      expect(result.status).toBe(OrderStatusEnum.PREPARING);
    });

    it('should handle order with customer when updating status', async () => {
      const orderId = uuidv4();
      const customerId = uuidv4();
      const itemId = uuidv4();

      const mockUpdatedOrder = {
        id: orderId,
        customerId: customerId,
        status: 'RECEIVED',
        totalAmount: new Decimal(50.0),
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            itemId: itemId,
            orderId: orderId,
            quantity: 1,
            price: new Decimal(50.0),
          },
        ],
      };

      prismaService.order.update.mockResolvedValue(mockUpdatedOrder);

      const result = await repository.updateStatus(
        orderId,
        OrderStatusEnum.RECEIVED,
      );

      expect(result.customerId).toBe(customerId);
    });
  });
});
