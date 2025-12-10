import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/prisma.service';
import Order from 'src/order/entities/order.entity';
import { OrderStatus } from '@prisma/client';
import OrderRepositoryInterface from 'src/order/interfaces/OrderRepository.interface';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import { OrderPersistenceMapper, RawQueryOrderResult } from './mappers/order.mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    try {
      console.log('Creating order in repository:', order);
      console.log('CustomerId:', order.customerId);
      const createdRecord = await this.prisma.order.create({
        data: {
          id: order.id,
          status: order.status,
          customerId: order.customerId ,
          totalAmount: order.totalAmount,
        },
      });

      const createdItemOrder = await this.prisma.orderItem.createManyAndReturn({
        data: order.orderItems.map((item) => ({
          itemId: item._itemId,
          orderId: createdRecord.id,
          quantity: item._quantity,
          price: item._price,
        })),
        skipDuplicates: true,
      });

      
      return OrderPersistenceMapper.mapSimplePrismaOrderToDomain(createdRecord, createdItemOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async findById(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true},
    });

    if (!order) {
      throw new NotFoundException('Order not found in repository');
    }

    return OrderPersistenceMapper.mapPrismaOrderToDomain(order);
  }

  async findAll(): Promise<Order[]> {
    try {
      const rawResults: RawQueryOrderResult[] = await this.prisma.$queryRaw`
      SELECT
      o.id, 
      o.status, 
      o."totalAmount", 
      o."createdAt",
      o."customerId",
      o."updatedAt",
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'itemId', oi."itemId",
            'orderId', oi."orderId",
            'quantity', oi.quantity,
            'price', oi.price
          )
      ) AS items
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
WHERE o.status IN ('READY', 'PREPARING', 'RECEIVED')
GROUP BY o.id, o.status, o."totalAmount", o."createdAt", o."customerId", o."updatedAt"
ORDER BY
  CASE o.status
    WHEN 'READY' THEN 1
    WHEN 'PREPARING' THEN 2
    WHEN 'RECEIVED' THEN 3
  END,  
  o."createdAt" ASC;
      `;
      return OrderPersistenceMapper.mapRawQueryArrayToDomain(rawResults);
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw new Error('Failed to find orders');
    }
  }

  async updateStatus(id: string, status: OrderStatusEnum): Promise<Order> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: status as OrderStatus },
        include: { orderItems: true },
      });

      return OrderPersistenceMapper.mapPrismaOrderToDomain(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status for ${id}`);
    }
  }
}
