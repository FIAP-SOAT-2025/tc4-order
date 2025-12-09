/* eslint-disable prettier/prettier */
import { OrderPresentationMapper } from '../../../presenters/mappers/order-presentation.mapper';
import Order from '../../../entities/order.entity';
import { OrderItem } from '../../../entities/orderItem.entity';
import { OrderDto, OrderItemDto } from '../../../infraestructure/api/dto/order.dto';

describe('OrderPresentationMapper', () => {
  describe('mapOrderItemToInterface', () => {
    it('should map OrderItem to OrderItemInterface', () => {
      const orderItem = OrderItem.create({
        itemId: 'item-123',
        quantity: 2,
        price: 50.0,
      });

      const result = OrderPresentationMapper.mapOrderItemToInterface(orderItem);

      expect(result).toEqual({
        itemId: 'item-123',
        quantity: 2,
        price: 50.0,
        itemQuantity: 2,
      });
    });
  });

  describe('mapOrderItemsToInterface', () => {
    it('should map array of OrderItems to OrderItemInterfaces', () => {
      const orderItems = [
        OrderItem.create({ itemId: 'item-1', quantity: 1, price: 10.0 }),
        OrderItem.create({ itemId: 'item-2', quantity: 2, price: 20.0 }),
      ];

      const result = OrderPresentationMapper.mapOrderItemsToInterface(orderItems);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        itemId: 'item-1',
        quantity: 1,
        price: 10.0,
        itemQuantity: 1,
      });
      expect(result[1]).toEqual({
        itemId: 'item-2',
        quantity: 2,
        price: 20.0,
        itemQuantity: 2,
      });
    });
  });

  describe('mapOrderToInterface', () => {
    it('should map Order to OrderInterface', () => {
      const order = Order.create({
        id: 'order-123',
        customerId: 'customer-456',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 50.0 },
        ],
      });

      const result = OrderPresentationMapper.mapOrderToInterface(order);

      expect(result.id).toBe('order-123');
      expect(result.customerId).toBe('customer-456');
      expect(result.totalAmount).toBe(50.0);
      expect(result.orderItems).toHaveLength(1);
    });
  });

  describe('mapOrdersToInterface', () => {
    it('should map array of Orders to OrderInterfaces', () => {
      const orders = [
        Order.create({
          id: 'order-1',
          orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
        }),
        Order.create({
          id: 'order-2',
          orderItems: [{ itemId: 'item-2', quantity: 2, price: 20.0 }],
        }),
      ];

      const result = OrderPresentationMapper.mapOrdersToInterface(orders);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('order-1');
      expect(result[1].id).toBe('order-2');
    });
  });

  describe('mapOrderItemDtoToInterface', () => {
    it('should map OrderItemDto to OrderItemInterface', () => {
      const dto: OrderItemDto = {
        itemId: 'item-789',
        itemQuantity: 3,
      };

      const result = OrderPresentationMapper.mapOrderItemDtoToInterface(dto);

      expect(result).toEqual({
        itemId: 'item-789',
        itemQuantity: 3,
        quantity: 3,
      });
    });
  });

  describe('mapOrderDtoToInterface', () => {
    it('should map OrderDto to OrderInterface', () => {
      const dto: OrderDto = {
        customerCpf: '12345678900',
        orderItems: [
          { itemId: 'item-1', itemQuantity: 2 },
          { itemId: 'item-2', itemQuantity: 1 },
        ],
      };

      const result = OrderPresentationMapper.mapOrderDtoToInterface(dto);

      expect(result.customerCpf).toBe('12345678900');
      expect(result.orderItems).toHaveLength(2);
      expect(result.orderItems[0].itemId).toBe('item-1');
    });
  });

  describe('mapOrderToApiResponse', () => {
    it('should map Order to API response format', () => {
      const order = Order.create({
        id: 'order-123',
        customerId: 'customer-456',
        orderItems: [
          { itemId: 'item-1', quantity: 2, price: 50.5 },
        ],
      });

      const result = OrderPresentationMapper.mapOrderToApiResponse(order);

      expect(result.id).toBe('order-123');
      expect(result.customerId).toBe('customer-456');
      expect(result.totalAmount).toBe('101.00');
      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
      expect(result.orderItems[0].price).toBe('50.50');
    });
  });

  describe('mapOrderToSummary', () => {
    it('should map Order to summary format', () => {
      const order = Order.create({
        id: 'order-789',
        customerId: 'customer-999',
        orderItems: [
          { itemId: 'item-1', quantity: 1, price: 10.0 },
          { itemId: 'item-2', quantity: 2, price: 20.0 },
        ],
      });

      const result = OrderPresentationMapper.mapOrderToSummary(order);

      expect(result.id).toBe('order-789');
      expect(result.customerId).toBe('customer-999');
      expect(result.totalAmount).toBe(50.0);
      expect(result.itemCount).toBe(2);
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('mapOrdersToSummary', () => {
    it('should map array of Orders to summary format', () => {
      const orders = [
        Order.create({
          id: 'order-1',
          orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
        }),
        Order.create({
          id: 'order-2',
          orderItems: [
            { itemId: 'item-2', quantity: 2, price: 20.0 },
            { itemId: 'item-3', quantity: 1, price: 15.0 },
          ],
        }),
      ];

      const result = OrderPresentationMapper.mapOrdersToSummary(orders);

      expect(result).toHaveLength(2);
      expect(result[0].itemCount).toBe(1);
      expect(result[1].itemCount).toBe(2);
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in BRL format', () => {
      const result = OrderPresentationMapper.formatCurrency(100.50);

      expect(result).toBe('R$ 100,50');
    });

    it('should handle zero values', () => {
      const result = OrderPresentationMapper.formatCurrency(0);

      expect(result).toBe('R$ 0,00');
    });

    it('should handle large values', () => {
      const result = OrderPresentationMapper.formatCurrency(1000000.99);

      expect(result).toBe('R$ 1.000.000,99');
    });
  });

  describe('mapOrderToDisplayFormat', () => {
    it('should map Order to display format with formatted currency', () => {
      const order = Order.create({
        id: 'order-display',
        customerId: 'customer-display',
        orderItems: [
          { itemId: 'item-1', quantity: 2, price: 25.5 },
          { itemId: 'item-2', quantity: 1, price: 100.0 },
        ],
      });

      const result = OrderPresentationMapper.mapOrderToDisplayFormat(order);

      expect(result.id).toBe('order-display');
      expect(result.totalAmount).toContain('R$');
      expect(result.totalAmount).toContain('151,00');
      expect(result.orderItems).toHaveLength(2);
      expect(result.orderItems[0].price).toContain('R$');
      expect(result.orderItems[0].subtotal).toContain('R$');
    });

    it('should format dates in pt-BR locale', () => {
      const order = Order.create({
        id: 'order-123',
        orderItems: [{ itemId: 'item-1', quantity: 1, price: 10.0 }],
      });

      const result = OrderPresentationMapper.mapOrderToDisplayFormat(order);

      expect(typeof result.createdAt).toBe('string');
      expect(typeof result.updatedAt).toBe('string');
    });
  });
});
