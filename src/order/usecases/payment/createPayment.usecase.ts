import { CreatePaymentInterface } from "src/order/interfaces/createPayment.interface";
import { PaymentGatewayInterface } from "src/order/interfaces/gateways-interfaces/payment-gateway.interface";

import { InputPayment, PaymentExternallyResponse } from "src/order/interfaces/responses-interfaces/payment-response.interface";

export class CreatePaymentUseCase implements CreatePaymentInterface {
  constructor(
    private readonly paymentGateway: PaymentGatewayInterface,
   
  ) {}

  async createPayment(
    customer_email: string,
    orderId: string,
    amount: number
  ): Promise<PaymentExternallyResponse> {
    console.log("::22:40::CreatePaymentUseCase - createPayment called with:", { customer_email, orderId, amount });
      const paymentInput: InputPayment = {
        customer_email,
        amount,
        orderId,
        
      };
    const provideResponse : PaymentExternallyResponse = await this.paymentGateway.createPaymentGateway(paymentInput);
    console.log("provideResponse:", provideResponse);
    
      const paymentyExternall : PaymentExternallyResponse = {
        paymentId: provideResponse.paymentId,
        status: provideResponse.status
      };

    return paymentyExternall;
  }
}
