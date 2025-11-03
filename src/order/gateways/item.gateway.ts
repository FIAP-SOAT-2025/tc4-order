import { ItemClient } from "../infraestructure/external/item/item.client";
import { ItemGatewayInterface } from "../interfaces/gateways-interfaces/item-gateway.interface";
import { ItemResponse } from "../interfaces/responses-interfaces/item-reponse.interface";

export class ItemGateway implements ItemGatewayInterface {

        constructor(private itemClient: ItemClient) {}

     async getItem(itemId: string): Promise<ItemResponse | null>{

        console.log("itemId no gateway:", itemId);
        const itemExternally = await this.itemClient.getItemExternally(itemId);
        if (!itemExternally) {
            return null;
        }
        const item: ItemResponse = {
            id: itemExternally.id,
            price: itemExternally.price,
            quantity: itemExternally.quantity,
        };
        console.log("item no gateway:", item);

        return item;
        
     }
} 