import { InputPayment, PaymentExternallyResponse } from "src/order/interfaces/responses-interfaces/payment-response.interface";
import { PaymentGatewayInterface } from "../interfaces/gateways-interfaces/payment-gateway.interface";
import { PaymentClientInterface } from "../interfaces/clients-interfaces/payment-client.interface";


export class PaymentGateway implements PaymentGatewayInterface {
    constructor( private readonly paymentClient: PaymentClientInterface,) {}

  async createPayment(input: InputPayment): Promise<PaymentExternallyResponse> {
    console.log("PaymentGateway - createPayment called with:", input);
    const response = await this.paymentClient.createPaymentExternal(input);
    return response;
    
  }
}
