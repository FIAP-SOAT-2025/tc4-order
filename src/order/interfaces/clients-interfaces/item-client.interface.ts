import { ItemResponse } from "../responses-interfaces/item-reponse.interface";




export interface ItemClientInterface {
  getItemExternally(itemId: string): Promise<ItemResponse | null>;
  updateItemQuantityExternally(itemId: string, quantity: number): Promise<void>;
}