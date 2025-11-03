import { PaymentClientInterface } from "src/order/interfaces/clients-interfaces/payment-client.interface";
import { PaymentGatewayInterface } from "src/order/interfaces/gateways-interfaces/payment-gateway.interface";

import { InputPayment, PaymentExternallyResponse } from "src/order/interfaces/responses-interfaces/payment-response.interface";

export class CreatePaymentUseCase  {
  constructor(
    private readonly paymentGateway: PaymentGatewayInterface,
   
  ) {}

  async createPayment(
    email: string,
    orderId: string,
    totalAmount: number
  ): Promise<PaymentExternallyResponse | null> {
    console.log("CreatePaymentUseCase - createPayment called with:", { email, orderId, totalAmount });
      const paymentInput: InputPayment = {
        email,
        orderId,
        totalAmount
      };
    const provideResponse : PaymentExternallyResponse = await this.paymentGateway.createPayment(paymentInput);
    console.log("provideResponse:", provideResponse);
    
      const paymentyExternall : PaymentExternallyResponse = {
        paymentId: provideResponse.paymentId,
        status: provideResponse.status
      };

    return paymentyExternall;
  }
}
