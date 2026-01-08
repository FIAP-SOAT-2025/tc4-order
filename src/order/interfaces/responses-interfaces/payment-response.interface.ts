export interface PaymentExternallyResponse {
    id: string,
    status: string,
};

export interface InputPayment {
    customer_email: string,
    amount: number,
    orderId: string,
   
}