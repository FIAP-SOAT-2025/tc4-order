import { InputPayment, PaymentExternallyResponse } from "../responses-interfaces/payment-response.interface";

export interface PaymentGatewayInterface {
  createPaymentGateway(input: InputPayment): Promise<PaymentExternallyResponse>;
}
