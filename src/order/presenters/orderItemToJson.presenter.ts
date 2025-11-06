
import OrderItemInterface from '../interfaces/order-item.interface';

export default class OrderItemPresenter {
  constructor() {}
  //revisar
  static formatOrderItemToJson(item: any): OrderItemInterface {
    return {
      itemId: item.id || '',
      quantity: item.quantity,
      price: item.price,
    };
  }
}
