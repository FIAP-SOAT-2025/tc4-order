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
    OrderPresentationMapper.mapOrderItemToInterface(mockOrderItem);
  });

  it('should map order items to interface', () => {
    OrderPresentationMapper.mapOrderItemsToInterface([mockOrderItem]);
  });

  it('should map order to interface', () => {
    OrderPresentationMapper.mapOrderToInterface(mockOrder);
  });

  it('should map orders to interface', () => {
    OrderPresentationMapper.mapOrdersToInterface([mockOrder]);
  });

  it('should map order item dto to interface', () => {
    OrderPresentationMapper.mapOrderItemDtoToInterface({
      itemId: 'item-1',
      itemQuantity: 2,
    });
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

    OrderPresentationMapper.mapOrderDtoToInterface(dto);
  });

  it('should map order to api response', () => {
    OrderPresentationMapper.mapOrderToApiResponse(mockOrder);
  });

  it('should map order to summary', () => {
    OrderPresentationMapper.mapOrderToSummary(mockOrder);
  });

  it('should map orders to summary', () => {
    OrderPresentationMapper.mapOrdersToSummary([mockOrder]);
  });

  it('should format currency', () => {
    OrderPresentationMapper.formatCurrency(100);
  });

  it('should map order to display format', () => {
    OrderPresentationMapper.mapOrderToDisplayFormat(mockOrder);
  });
});
