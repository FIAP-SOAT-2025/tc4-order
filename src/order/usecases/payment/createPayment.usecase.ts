import { CreatePaymentInterface } from "src/order/interfaces/createPayment.interface";
import { PaymentGatewayInterface } from "src/order/interfaces/gateways-interfaces/payment-gateway.interface";

import { InputPayment, PaymentExternallyResponse } from "src/order/interfaces/responses-interfaces/payment-response.interface";

export class CreatePaymentUseCase implements CreatePaymentInterface {
  constructor(
    private readonly paymentGateway: PaymentGatewayInterface,
   
  ) {}

  async createPayment(
    email: string,
    orderId: string,
    totalAmount: number
  ): Promise<PaymentExternallyResponse> {
    console.log("CreatePaymentUseCase - createPayment called with:", { email, orderId, totalAmount });
      const paymentInput: InputPayment = {
        email,
        totalAmount,
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
