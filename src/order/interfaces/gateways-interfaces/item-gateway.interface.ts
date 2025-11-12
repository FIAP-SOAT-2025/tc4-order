import { ItemResponse } from "../responses-interfaces/item-reponse.interface";



/**
 * Gateway Interface para comunicação com serviços externos de Item
 * Seguindo Clean Architecture - Camada de Domínio (interface)
 * A implementação fica na camada de Infraestrutura
 */
export interface ItemGatewayInterface {
  getItem(itemId: string): Promise<ItemResponse | null>;
}
