import { InputPayment, PaymentExternallyResponse } from "../responses-interfaces/payment-response.interface";



export interface PaymentClientInterface {
    createPaymentExternal(data: InputPayment): Promise<PaymentExternallyResponse>;
    getPaymentStatus(paymentId: string): Promise<PaymentExternallyResponse>;
}