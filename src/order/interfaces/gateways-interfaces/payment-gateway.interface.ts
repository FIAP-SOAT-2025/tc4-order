import { InputPayment, PaymentExternallyResponse } from "../responses-interfaces/payment-response.interface";

export interface PaymentGatewayInterface {
  createPayment(input: InputPayment): Promise<PaymentExternallyResponse>;
}
