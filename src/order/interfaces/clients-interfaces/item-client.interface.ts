import { ItemResponse } from './responses-interfaces/item-reponse.interface';



export interface ItemClientInterface {
  getItemExternally(itemId: string): Promise<ItemResponse | null>;
}