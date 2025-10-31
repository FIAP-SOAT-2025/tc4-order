import { Customer } from "../entities/customer/customer.entity";

export interface GetCustomerByCpfInterface {
  getCustomerByCpf(cpf: string): Promise<Customer>;
}