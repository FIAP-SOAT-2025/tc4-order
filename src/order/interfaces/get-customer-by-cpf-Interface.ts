import { CustomerExternallyResponse } from "./responses-interfaces/customer-externally-response.interface";


export interface GetCustomerByCpfInterface {
  getCustomerByCpf(cpf: string): Promise<CustomerExternallyResponse>;
}
