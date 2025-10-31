import { Customer } from "../entities/customer/customer.entity";



export interface CustomerClientOrderInterface {
  findByCpf(cpf: string): Promise<Customer | null>;
}