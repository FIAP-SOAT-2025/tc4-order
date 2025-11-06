import { Injectable, Inject } from "@nestjs/common";
import { CustomerClientInterface } from "../interfaces/clients-interfaces/customer-client.interface";
import { CustomerExternallyResponse } from "../interfaces/responses-interfaces/customer-externally-response.interface";
import { CustomerGatewayInterface } from "../interfaces/gateways-interfaces/customer-gateway.interface";

@Injectable()
export class CustomerGateway implements CustomerGatewayInterface {
  constructor(@Inject('CustomerClientInterface') private readonly customerClient: CustomerClientInterface) {
    console.log("CustomerGateway construído com customerClient:", !!this.customerClient);
  }

  async findByCpf(cpf: string): Promise<CustomerExternallyResponse | null> {
    console.log("cpf no gateway:", cpf);
    console.log("customerClient definido?", !!this.customerClient);
    console.log("customerClient tipo:", typeof this.customerClient);

    try {
      if (!this.customerClient) {
        throw new Error("CustomerClient não foi injetado corretamente");
      }

      const customer: CustomerExternallyResponse | null = await this.customerClient.findByCpfExternally(cpf);
        if (!customer) {
            return null;
        }
        const customerExternally: CustomerExternallyResponse = {
            id: customer.id,
            email: customer.email
        };

        return customerExternally;
    } catch (error) {
        console.log("Erro no gateway ao buscar cliente por CPF:", error);
        throw new Error(`Failed to fetch customer by CPF - ${JSON.stringify(error)}`);
    }
}
}