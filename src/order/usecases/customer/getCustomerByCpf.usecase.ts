import { CustomerClient } from '../../infraestructure/external/customer/customer.client';
import { Cpf, Customer } from '../../entities/customer/customer.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { Injectable } from '@nestjs/common';
import { GetCustomerByCpfInterface } from 'src/order/interfaces/get-customer-by-cpf-Interface';

@Injectable()
export default class GetCustomerByCpf   implements GetCustomerByCpfInterface {
  constructor(
     private readonly customerClient: CustomerClient
  ) {}
  async getCustomerByCpf(cpf: string): Promise<Customer> {

    const customer = await this.customerClient.findByCpf(
      new Cpf(cpf).getCpf(),
    );
    if (!customer) {
      throw new BaseException(
        `Customer with CPF ${cpf} not found`,
        404,
        'CUSTOMER_NOT_FOUND',
      );
    }
    return customer;
  }
}
