import { PaymentExternallyResponse } from "./responses-interfaces/payment-response.interface";
export interface CreatePaymentInterface {
  createPayment(
    email: string,
    orderId: string,
    totalAmount: number
  ): Promise<PaymentExternallyResponse>;
}

