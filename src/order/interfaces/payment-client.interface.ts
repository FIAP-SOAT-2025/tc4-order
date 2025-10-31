export interface PaymentClientInterface {
    createPaymentExternal(data: any): Promise<any>;
    getPaymentStatus(paymentId: string): Promise<any>;
}