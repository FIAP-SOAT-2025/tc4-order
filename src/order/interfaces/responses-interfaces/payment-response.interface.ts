export interface PaymentExternallyResponse {
    paymentId: String,
    status: String,
};

export interface InputPayment {
    email: string,
    orderId: string,
    totalAmount: number
}