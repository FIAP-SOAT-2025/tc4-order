import { CustomerClient } from "../infraestructure/external/customer/customer.client";
import { CustomerExternallyResponse } from "../interfaces/responses-interfaces/customer-externally-response.interface";
import { CustomerGatewayInterface } from "../interfaces/gateways-interfaces/customer-gateway.interface";

export class CustomerGateway implements CustomerGatewayInterface {
  constructor(private readonly customerClient: CustomerClient) {}

  async findByCpf(cpf: string): Promise<CustomerExternallyResponse | null> {
    console.log("cpf no gateway:", cpf);
        const customer: CustomerExternallyResponse | null = await this.customerClient.findByCpfExternally(cpf);
        if (!customer) {
            return null;
        }
        const customerExternally: CustomerExternallyResponse = {
            id: customer.id,
            email: customer.email
        };

        return customerExternally;
  }
}