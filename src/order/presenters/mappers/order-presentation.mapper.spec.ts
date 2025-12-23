import { OrderPresentationMapper } from './order-presentation.mapper';
import Order from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { OrderDto } from 'src/order/infraestructure/api/dto/order.dto';

describe('OrderPresentationMapper', () => {
  const mockOrderItem = {
    itemId: 'item-1',
    quantity: 2,
    price: 10,
  } as OrderItem;

  const mockOrder = {
    id: 'order-1',
    status: 'CREATED',
    totalAmount: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    customerId: 'customer-1',
    orderItems: [mockOrderItem],
  } as unknown as Order;

  it('should map order item to interface', () => {
    const result = OrderPresentationMapper.mapOrderItemToInterface(mockOrderItem);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('itemId', mockOrderItem.itemId);
    expect(result).toHaveProperty('quantity', mockOrderItem.quantity);
    expect(result).toHaveProperty('price', mockOrderItem.price);
    expect(result).toHaveProperty('itemQuantity', mockOrderItem.quantity);
  });

  it('should map order items to interface', () => {
    const result = OrderPresentationMapper.mapOrderItemsToInterface([mockOrderItem]);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);


    const item = result[0];
    expect(item).toHaveProperty('itemId', mockOrderItem.itemId);
    expect(item).toHaveProperty('quantity', mockOrderItem.quantity);
    expect(item).toHaveProperty('price', mockOrderItem.price);
    expect(item).toHaveProperty('itemQuantity', mockOrderItem.quantity);
  });

  it('should map order to interface', () => {
    const result = OrderPresentationMapper.mapOrderToInterface(mockOrder);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', mockOrder.id);
    expect(result).toHaveProperty('status', mockOrder.status);
    expect(result).toHaveProperty('totalAmount', mockOrder.totalAmount);
    expect(result).toHaveProperty('createdAt', mockOrder.createdAt);
    expect(result).toHaveProperty('updatedAt', mockOrder.updatedAt);
    expect(result).toHaveProperty('customerId', mockOrder.customerId);


    expect(result).toHaveProperty('orderItems');
    expect(Array.isArray(result.orderItems)).toBe(true);
    expect(result.orderItems).toHaveLength(mockOrder.orderItems.length);

    const item = result.orderItems[0];
    expect(item).toHaveProperty('itemId', mockOrder.orderItems[0].itemId);
    expect(item).toHaveProperty('quantity', mockOrder.orderItems[0].quantity);
    expect(item).toHaveProperty('price', mockOrder.orderItems[0].price);
    expect(item).toHaveProperty('itemQuantity', mockOrder.orderItems[0].quantity);
  });

  it('should map orders to interface', () => {
    const result = OrderPresentationMapper.mapOrdersToInterface([mockOrder]);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);

    const mappedOrder = result[0];

    expect(mappedOrder).toHaveProperty('id', mockOrder.id);
    expect(mappedOrder).toHaveProperty('status', mockOrder.status);
    expect(mappedOrder).toHaveProperty('totalAmount', mockOrder.totalAmount);
    expect(mappedOrder).toHaveProperty('customerId', mockOrder.customerId);

    expect(mappedOrder).toHaveProperty('orderItems');
    expect(Array.isArray(mappedOrder.orderItems)).toBe(true);
    expect(mappedOrder.orderItems).toHaveLength(mockOrder.orderItems.length);
  });

  it('should map order item dto to interface', () => {
    const orderItemDTO = {
      itemId: 'item-1',
      itemQuantity: 2,
    }

    const result = OrderPresentationMapper.mapOrderItemDtoToInterface(orderItemDTO);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('itemId', mockOrderItem.itemId);
    expect(result).toHaveProperty('quantity', mockOrderItem.quantity);
    expect(result).toHaveProperty('itemQuantity', mockOrderItem.quantity);
  });

  it('should map order dto to interface', () => {
    const dto: OrderDto = {
      customerCpf: '12345678900',
      orderItems: [
        {
          itemId: 'item-1',
          itemQuantity: 1,
        },
      ],
    };

    const result = OrderPresentationMapper.mapOrderDtoToInterface(dto);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('customerCpf', dto.customerCpf);
    expect(result).toHaveProperty('orderItems');
    expect(Array.isArray(result.orderItems)).toBe(true);
    expect(result.orderItems).toHaveLength(dto.orderItems.length);
  });

  it('should map order to api response', () => {
    const result = OrderPresentationMapper.mapOrderToApiResponse(mockOrder);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', mockOrder.id);
    expect(result).toHaveProperty('status', mockOrder.status);
    expect(result).toHaveProperty('totalAmount', mockOrder.totalAmount.toFixed(2));
    expect(result).toHaveProperty('createdAt', mockOrder.createdAt.toISOString());
    expect(result).toHaveProperty('updatedAt', mockOrder.updatedAt.toISOString());
    expect(result).toHaveProperty('customerId', mockOrder.customerId);

    expect(result).toHaveProperty('orderItems');
    expect(Array.isArray(result.orderItems)).toBe(true);
    expect(result.orderItems).toHaveLength(mockOrder.orderItems.length);
  });

  it('should map order to summary', () => {
    const result = OrderPresentationMapper.mapOrderToSummary(mockOrder);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', mockOrder.id);
    expect(result).toHaveProperty('status', mockOrder.status);
    expect(result).toHaveProperty('totalAmount', mockOrder.totalAmount);
    expect(result).toHaveProperty('createdAt', mockOrder.createdAt);
    expect(result).toHaveProperty('customerId', mockOrder.customerId);
  });

  it('should map orders to summary', () => {
    const mock = [mockOrder]
    const result = OrderPresentationMapper.mapOrdersToSummary(mock);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(mock.length);

    const mappedSummary = result[0];

    expect(mappedSummary).toBeDefined();
    expect(mappedSummary).toHaveProperty('id', mockOrder.id);
    expect(mappedSummary).toHaveProperty('status', mockOrder.status);
    expect(mappedSummary).toHaveProperty('totalAmount', mockOrder.totalAmount);
    expect(mappedSummary).toHaveProperty('createdAt', mockOrder.createdAt);
    expect(mappedSummary).toHaveProperty('customerId', mockOrder.customerId);
  });

  it('should format currency', () => {
    const mock = 100
    const result = OrderPresentationMapper.formatCurrency(mock);
    expect(result.replace(/\s/g, ' ')).toBe('R$ 100,00');
  });

  it('should map order to display format', () => {
    const result = OrderPresentationMapper.mapOrderToDisplayFormat(mockOrder);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', mockOrder.id);
    expect(result).toHaveProperty('status', mockOrder.status);
    expect(result).toHaveProperty('totalAmount');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).toHaveProperty('customerId', mockOrder.customerId);

    expect(result).toHaveProperty('orderItems');
    expect(Array.isArray(result.orderItems)).toBe(true);
    expect(result.orderItems).toHaveLength(mockOrder.orderItems.length);
  });
});
