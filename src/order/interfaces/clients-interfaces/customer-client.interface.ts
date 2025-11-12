import { CustomerExternallyResponse } from "../responses-interfaces/customer-externally-response.interface";




export interface CustomerClientInterface {
  findByCpfExternally(cpf: string): Promise<CustomerExternallyResponse | null>;
}