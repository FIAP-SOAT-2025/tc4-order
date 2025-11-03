import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/infra/prisma.service';
import Order from 'src/order/entities/order.entity';
import { OrderStatus } from '@prisma/client';
import OrderGatewayInterface from 'src/order/interfaces/gateways-interfaces/oreder-gateways.interface';

@Injectable()
export class PrismaOrderRepository implements OrderGatewayInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order): Promise<any> {
    try {
      console.log('Creating order in repository:', order);
      const createdRecord = await this.prisma.order.create({
        data: {
          id: order.id,
          status: order.status,
          customerId: order.customerId,
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

      return {
        ...createdRecord,
        price: Number(createdRecord.totalAmount),
        orderItems: createdItemOrder,
        payment: undefined,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async findById(id: string): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true, payment: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.$queryRaw`
      SELECT
      o.id, 
      o.status, 
      o."totalAmount", 
      o."createdAt",
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'itemId', oi."itemId",
          'orderId', oi."orderId",
          'quantity', oi.quantity,
          'price', oi.price
        )
      ) AS items,
      JSON_BUILD_OBJECT(
        'id', p.id,
        'status', p.status,
        'type', p.type,
        'mercadoPagoPaymentId', p."mercadoPagoPaymentId",
        'qrCode', p."qrCode"
      ) AS payment 
FROM "Order" o
JOIN "OrderItem" oi ON oi."orderId" = o.id
LEFT JOIN "Payment" p ON p."orderId" = o.id
WHERE o.status IN ('READY', 'PREPARING', 'RECEIVED')
GROUP BY o.id, o.status, o."totalAmount", o."createdAt", p.id, p.status, p.type, p."mercadoPagoPaymentId", p."qrCode"
ORDER BY
  CASE o.status
    WHEN 'READY' THEN 1
    WHEN 'PREPARING' THEN 2
    WHEN 'RECEIVED' THEN 3
  END,  
  o."createdAt" ASC;
      `;
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw new Error('Failed to find orders');
    }
  }

  async updateStatus(id: string, status: string): Promise<any> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: status as OrderStatus },
        include: { orderItems: true },
      });

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status for ${id}`);
    }
  }
}
