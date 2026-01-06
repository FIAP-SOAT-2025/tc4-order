import { PaymentExternallyResponse } from "./responses-interfaces/payment-response.interface";
export interface CreatePaymentInterface {
  createPayment(
    customer_email: string,
    orderId: string,
    amount: number
  ): Promise<PaymentExternallyResponse>;
}

