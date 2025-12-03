export interface PaymentExternallyResponse {
    paymentId: String,
    status: String,
};

export interface InputPayment {
    email: string,
    totalAmount: number,
    orderId: string,
   
}