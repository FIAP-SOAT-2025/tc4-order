import Order from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import OrderInterface from 'src/order/interfaces/order.interface';
import OrderItemInterface from 'src/order/interfaces/order-item.interface';
import { OrderDto, OrderItemDto } from 'src/order/infraestructure/api/dto/order.dto';


export class OrderPresentationMapper {

  
  static mapOrderItemToInterface(orderItem: OrderItem): OrderItemInterface {
    return {
      itemId: orderItem.itemId,
      quantity: orderItem.quantity,
      price: orderItem.price,
      itemQuantity: orderItem.quantity, 
    };
  }

  
  static mapOrderItemsToInterface(orderItems: OrderItem[]): OrderItemInterface[] {
    return orderItems.map(item => this.mapOrderItemToInterface(item));
  }

  
  static mapOrderToInterface(order: Order): OrderInterface {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customerId: order.customerId,
      orderItems: this.mapOrderItemsToInterface(order.orderItems),
    };
  }

  
  static mapOrdersToInterface(orders: Order[]): OrderInterface[] {
    return orders.map(order => this.mapOrderToInterface(order));
  }

  
  static mapOrderItemDtoToInterface(dto: OrderItemDto): OrderItemInterface {
    return {
      itemId: dto.itemId,
      itemQuantity: dto.itemQuantity,
      quantity: dto.itemQuantity,
    };
  }

  
  static mapOrderDtoToInterface(dto: OrderDto): OrderInterface {
    return {
      customerCpf: dto.customerCpf,
      orderItems: dto.orderItems.map(item => this.mapOrderItemDtoToInterface(item)),
    };
  }

  
  static mapOrderToApiResponse(order: Order): {
    id: string;
    status: string;
    totalAmount: string; 
    createdAt: string;
    updatedAt: string;
    customerId?: string;
    orderItems: Array<{
      itemId: string;
      quantity: number;
      price: string; 
    }>;
  } {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount.toFixed(2),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customerId: order.customerId,
      orderItems: order.orderItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: item.price.toFixed(2),
      })),
    };
  }

  
  static mapOrderToSummary(order: Order): {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    itemCount: number;
    customerId?: string;
  } {
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      itemCount: order.orderItems.length,
      customerId: order.customerId,
    };
  }

  static mapOrdersToSummary(orders: Order[]): Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    itemCount: number;
    customerId?: string;
  }> {
    return orders.map(order => this.mapOrderToSummary(order));
  }

  
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

 
  static mapOrderToDisplayFormat(order: Order): {
    id: string;
    status: string;
    totalAmount: string; 
    createdAt: string;   
    updatedAt: string;   
    customerId?: string;
    orderItems: Array<{
      itemId: string;
      quantity: number;
      price: string; 
      subtotal: string; 
    }>;
  } {
    return {
      id: order.id,
      status: order.status,
      totalAmount: this.formatCurrency(order.totalAmount),
      createdAt: order.createdAt.toLocaleDateString('pt-BR'),
      updatedAt: order.updatedAt.toLocaleDateString('pt-BR'),
      customerId: order.customerId,
      orderItems: order.orderItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        price: this.formatCurrency(item.price),
        subtotal: this.formatCurrency(item.price * item.quantity),
      })),
    };
  }
}