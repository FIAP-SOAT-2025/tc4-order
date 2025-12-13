import UpdateStatusOrderUseCase from './updateStatusOrder.usecase';
import FindOrderUseCase from '../findOrder/findOrder.usecase';
import Order from '../../../entities/order.entity';
import { OrderStatusEnum } from '../../../enums/orderStatus.enum';
import OrderGatewayInterface from '../../../interfaces/gateways-interfaces/oreder-gateways.interface';
import { ItemGatewayInterface } from '../../../interfaces/gateways-interfaces/item-gateway.interface';
import { v4 as uuidv4 } from 'uuid';

describe('UpdateStatusOrderUseCase', () => {
  let orderGatewayMock: jest.Mocked<OrderGatewayInterface>;
  let itemGatewayMock: jest.Mocked<ItemGatewayInterface>;

  beforeEach(() => {
    orderGatewayMock = {
      getOrderForId: jest.fn(),
      saveOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateStatusOrder: jest.fn(),
    };

    itemGatewayMock = {
      getItem: jest.fn(),
      updateQuantity: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('updateStatusOrder', () => {
    it('should successfully update order status to RECEIVED', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [
          { itemId: itemId1, quantity: 2, price: 25.0 },
          { itemId: itemId2, quantity: 1, price: 50.0 },
        ],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);
      itemGatewayMock.updateQuantity.mockResolvedValue(undefined);

      const result = await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        message: `Order with ID ${orderId} updated successfully`,
      });
      expect(FindOrderUseCase.findOrder).toHaveBeenCalledWith(orderId, orderGatewayMock);
      expect(orderGatewayMock.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.RECEIVED,
      );
      expect(itemGatewayMock.updateQuantity).toHaveBeenCalledTimes(2);
      expect(itemGatewayMock.updateQuantity).toHaveBeenNthCalledWith(1, itemId1, 2);
      expect(itemGatewayMock.updateQuantity).toHaveBeenNthCalledWith(2, itemId2, 1);
    });

    it('should update order status to PREPARING without updating item quantities', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.RECEIVED,
        orderItems: [{ itemId: itemId, quantity: 3, price: 30.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      const result = await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.PREPARING,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        message: `Order with ID ${orderId} updated successfully`,
      });
      expect(orderGatewayMock.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.PREPARING,
      );
      expect(itemGatewayMock.updateQuantity).not.toHaveBeenCalled();
    });

    it('should update order status to READY', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PREPARING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 100.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      const result = await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.READY,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        message: `Order with ID ${orderId} updated successfully`,
      });
      expect(orderGatewayMock.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.READY,
      );
      expect(itemGatewayMock.updateQuantity).not.toHaveBeenCalled();
    });

    it('should update order status to COMPLETED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.READY,
        orderItems: [{ itemId: itemId, quantity: 1, price: 50.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      const result = await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.COMPLETED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(result).toEqual({
        message: `Order with ID ${orderId} updated successfully`,
      });
      expect(orderGatewayMock.updateStatusOrder).toHaveBeenCalledWith(
        orderId,
        OrderStatusEnum.COMPLETED,
      );
    });

    it('should update item quantities only when status is RECEIVED', async () => {
      const orderId = uuidv4();
      const itemId1 = uuidv4();
      const itemId2 = uuidv4();
      const itemId3 = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [
          { itemId: itemId1, quantity: 5, price: 10.0 },
          { itemId: itemId2, quantity: 3, price: 20.0 },
          { itemId: itemId3, quantity: 1, price: 50.0 },
        ],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);
      itemGatewayMock.updateQuantity.mockResolvedValue(undefined);

      await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(itemGatewayMock.updateQuantity).toHaveBeenCalledTimes(3);
      expect(itemGatewayMock.updateQuantity).toHaveBeenNthCalledWith(1, itemId1, 5);
      expect(itemGatewayMock.updateQuantity).toHaveBeenNthCalledWith(2, itemId2, 3);
      expect(itemGatewayMock.updateQuantity).toHaveBeenNthCalledWith(3, itemId3, 1);
    });

    it('should call FindOrderUseCase to get order', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const findOrderSpy = jest
        .spyOn(FindOrderUseCase, 'findOrder')
        .mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(findOrderSpy).toHaveBeenCalledWith(orderId, orderGatewayMock);
      expect(findOrderSpy).toHaveBeenCalledTimes(1);
    });

    it('should call order.updateOrderStatus method', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const updateOrderStatusSpy = jest.spyOn(mockOrder, 'updateOrderStatus');

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(updateOrderStatusSpy).toHaveBeenCalledWith(OrderStatusEnum.RECEIVED);
      expect(updateOrderStatusSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle order with single item when updating to RECEIVED', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 10, price: 15.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);
      itemGatewayMock.updateQuantity.mockResolvedValue(undefined);

      await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(itemGatewayMock.updateQuantity).toHaveBeenCalledTimes(1);
      expect(itemGatewayMock.updateQuantity).toHaveBeenCalledWith(itemId, 10);
    });

    it('should return success message with correct order ID', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);

      const result = await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      expect(result).toBeDefined();
      expect(result.message).toBe(`Order with ID ${orderId} updated successfully`);
    });

    it('should propagate error when FindOrderUseCase fails', async () => {
      const orderId = uuidv4();
      const error = new Error('Order not found');

      jest.spyOn(FindOrderUseCase, 'findOrder').mockRejectedValue(error);

      await expect(
        UpdateStatusOrderUseCase.updateStatusOrder(
          orderId,
          OrderStatusEnum.RECEIVED,
          orderGatewayMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow('Order not found');
    });

    it('should propagate error when updateOrderStatus throws error', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.COMPLETED,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);

      await expect(
        UpdateStatusOrderUseCase.updateStatusOrder(
          orderId,
          OrderStatusEnum.PENDING,
          orderGatewayMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow();
    });

    it('should propagate error when gateway fails to update status', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const error = new Error('Database error');

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockRejectedValue(error);

      await expect(
        UpdateStatusOrderUseCase.updateStatusOrder(
          orderId,
          OrderStatusEnum.RECEIVED,
          orderGatewayMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow('Database error');
    });

    it('should propagate error when item gateway fails to update quantity', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();
      const error = new Error('Failed to update item quantity');

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      jest.spyOn(FindOrderUseCase, 'findOrder').mockResolvedValue(mockOrder);
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);
      itemGatewayMock.updateQuantity.mockRejectedValue(error);

      await expect(
        UpdateStatusOrderUseCase.updateStatusOrder(
          orderId,
          OrderStatusEnum.RECEIVED,
          orderGatewayMock,
          itemGatewayMock,
        ),
      ).rejects.toThrow('Failed to update item quantity');
    });

    it('should call all dependencies in correct order', async () => {
      const orderId = uuidv4();
      const itemId = uuidv4();

      const mockOrder = Order.create({
        id: orderId,
        status: OrderStatusEnum.PENDING,
        orderItems: [{ itemId: itemId, quantity: 1, price: 25.0 }],
      });

      const findOrderSpy = jest
        .spyOn(FindOrderUseCase, 'findOrder')
        .mockResolvedValue(mockOrder);
      const updateOrderStatusSpy = jest.spyOn(mockOrder, 'updateOrderStatus');
      orderGatewayMock.updateStatusOrder.mockResolvedValue(mockOrder as any);
      itemGatewayMock.updateQuantity.mockResolvedValue(undefined);

      await UpdateStatusOrderUseCase.updateStatusOrder(
        orderId,
        OrderStatusEnum.RECEIVED,
        orderGatewayMock,
        itemGatewayMock,
      );

      const findOrderCallOrder = findOrderSpy.mock.invocationCallOrder[0];
      const updateOrderStatusCallOrder = updateOrderStatusSpy.mock.invocationCallOrder[0];
      const updateStatusCallOrder =
        orderGatewayMock.updateStatusOrder.mock.invocationCallOrder[0];
      const updateQuantityCallOrder = itemGatewayMock.updateQuantity.mock.invocationCallOrder[0];

      expect(findOrderCallOrder).toBeLessThan(updateOrderStatusCallOrder);
      expect(updateOrderStatusCallOrder).toBeLessThan(updateStatusCallOrder);
      expect(updateStatusCallOrder).toBeLessThan(updateQuantityCallOrder);
    });
  });
});
