export interface PaymentExternallyResponse {
    paymentId: String,
    status: String,
};

export interface InputPayment {
    customer_email: string,
    amount: number,
    orderId: string,
   
}