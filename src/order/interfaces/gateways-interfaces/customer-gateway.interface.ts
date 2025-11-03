import { CustomerExternallyResponse } from "./responses-interfaces/customer-externally-response.interface";


/**
 * Gateway Interface para comunicação com serviços externos de Customer
 * Seguindo Clean Architecture - Camada de Domínio (interface)
 * A implementação fica na camada de Infraestrutura
 */
export interface CustomerGatewayInterface {
  findByCpf(cpf: string): Promise<CustomerExternallyResponse | null>;
}
