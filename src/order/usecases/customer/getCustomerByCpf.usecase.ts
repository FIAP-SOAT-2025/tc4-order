import { Cpf} from '../../entities/customerCpf/cpf.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { Injectable } from '@nestjs/common';
import { GetCustomerByCpfInterface } from 'src/order/interfaces/get-customer-by-cpf-Interface';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';
import { CustomerGatewayInterface } from 'src/order/interfaces/gateways-interfaces/customer-gateway.interface';

@Injectable()
export default class GetCustomerByCpf implements GetCustomerByCpfInterface {
  constructor(
     private readonly customerGateway: CustomerGatewayInterface
  ) {}
  
  async getCustomerByCpf(cpf: string): Promise<CustomerExternallyResponse> {
    console.log("cpf no usecase:", cpf);
    const customer = await this.customerGateway.findByCpf(
      Cpf.create(cpf).getCpf(),
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
