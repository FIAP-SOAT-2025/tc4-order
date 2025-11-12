import Order from '../entities/order.entity';
import OrderInterface from '../interfaces/order.interface';
import { OrderPresentationMapper } from './mappers/order-presentation.mapper';

export default class OrderPresenter {
  constructor() {}

  static formatOrderToJson(order: Order): OrderInterface {
    return OrderPresentationMapper.mapOrderToInterface(order);
  }

  static formatOrderToDisplay(order: Order) {
    return OrderPresentationMapper.mapOrderToDisplayFormat(order);
  }
}
