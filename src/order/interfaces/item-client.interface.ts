import Item from '../entities/item/item.entity';
import { ItemResponse } from './item-reponse.interface';



export interface ItemClientOrderInterface {
  getItem(itemId: string): Promise<ItemResponse | null>;
}