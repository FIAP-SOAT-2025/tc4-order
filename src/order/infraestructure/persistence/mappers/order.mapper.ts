import { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';

import { Decimal } from '@prisma/client/runtime/library';
import Order from 'src/order/entities/order.entity';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import { OrderItemProps } from 'src/order/entities/orderItem.entity';

export type PrismaOrderWithItems = PrismaOrder & {
  orderItems: PrismaOrderItem[];
};

export type PrismaOrderItemWithDecimal = {
  itemId: string;
  orderId: string;
  quantity: number;
  price: Decimal;
};

export type RawQueryOrderResult = {
  id: string;
  status: string;
  totalAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;
  customerId: string | null;
  items: Array<{
    itemId: string;
    orderId: string;
    quantity: number;
    price: Decimal;
  }>;
};

export class OrderPersistenceMapper {
  
  static mapOrderItemToDomain(item: PrismaOrderItem | PrismaOrderItemWithDecimal): OrderItemProps {
    return {
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price instanceof Decimal ? item.price.toNumber() : Number(item.price),
    };
  }

  static mapOrderItemsToDomain(items: (PrismaOrderItem | PrismaOrderItemWithDecimal)[]): OrderItemProps[] {
    return items.map(item => this.mapOrderItemToDomain(item));
  }


  static mapPrismaOrderToDomain(prismaOrder: PrismaOrderWithItems): Order {
    return Order.create({
      id: prismaOrder.id,
      status: prismaOrder.status as OrderStatusEnum,
      customerId: prismaOrder.customerId || undefined,
      totalAmount: prismaOrder.totalAmount instanceof Decimal 
        ? prismaOrder.totalAmount.toNumber() 
        : Number(prismaOrder.totalAmount),
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
      orderItems: this.mapOrderItemsToDomain(prismaOrder.orderItems)
    });
  }

  static mapRawQueryToDomain(rawResult: RawQueryOrderResult): Order {
    return Order.create({
      id: rawResult.id,
      status: rawResult.status as OrderStatusEnum,
      customerId: rawResult.customerId || undefined,
      totalAmount: rawResult.totalAmount instanceof Decimal 
        ? rawResult.totalAmount.toNumber() 
        : Number(rawResult.totalAmount),
      createdAt: rawResult.createdAt,
      updatedAt: rawResult.updatedAt,
      orderItems: this.mapOrderItemsToDomain(rawResult.items)
    });
  }

  static mapRawQueryArrayToDomain(rawResults: RawQueryOrderResult[]): Order[] {
    return rawResults.map(row => this.mapRawQueryToDomain(row));
  }

  static mapSimplePrismaOrderToDomain(
    prismaOrder: PrismaOrder, 
    orderItems: (PrismaOrderItem | PrismaOrderItemWithDecimal)[]
  ): Order {
    return Order.create({
      id: prismaOrder.id,
      status: prismaOrder.status as OrderStatusEnum,
      customerId: prismaOrder.customerId || undefined,
      totalAmount: prismaOrder.totalAmount instanceof Decimal 
        ? prismaOrder.totalAmount.toNumber() 
        : Number(prismaOrder.totalAmount),
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
      orderItems: this.mapOrderItemsToDomain(orderItems)
    });
  }

  static mapDomainOrderToPrismaCreate(order: Order) {
    return {
      id: order.id,
      status: order.status,
      customerId: order.customerId || null,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  static mapDomainOrderItemsToPrismaCreate(order: Order) {
    return order.orderItems.map((item) => ({
      itemId: item._itemId,
      orderId: order.id,
      quantity: item._quantity,
      price: item._price,
    }));
  }
}