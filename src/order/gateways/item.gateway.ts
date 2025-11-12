import { Injectable, Inject } from "@nestjs/common";
import { ItemClientInterface } from "../interfaces/clients-interfaces/item-client.interface";
import { ItemGatewayInterface } from "../interfaces/gateways-interfaces/item-gateway.interface";
import { ItemResponse } from "../interfaces/responses-interfaces/item-reponse.interface";

@Injectable()
export class ItemGateway implements ItemGatewayInterface {

        constructor(@Inject('ItemClientInterface') private itemClient: ItemClientInterface) {}

     async getItem(itemId: string): Promise<ItemResponse | null>{

        console.log("itemId no gateway:", itemId);
        const itemExternally = await this.itemClient.getItemExternally(itemId);
        console.log("itemExternally retornado do client:", itemExternally);
        
        if (!itemExternally) {
            console.log("Item não encontrado, retornando null");
            return null;
        }
        
        const item: ItemResponse = {
            id: itemExternally.id,
            price: itemExternally.price,
            quantity: itemExternally.quantity,
        };
        console.log("item formatado no gateway:", item);

        return item;
        
     }
} 