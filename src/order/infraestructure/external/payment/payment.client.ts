import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PaymentClientInterface } from "src/order/interfaces/payment-client.interface";

@Injectable()
export class PaymentClient implements PaymentClientInterface {
    private readonly api: AxiosInstance;
    constructor() {
        this.api = axios.create({
            baseURL: process.env.PAYMENT_SERVICE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    async createPaymentExternal(data: any): Promise<any> {
        const response = await this.api.post('/order/payment', data);
        return response.data;
    }

   /* async getPaymentStatus(paymentId: string): Promise<any> {
        const response = await this.api.get(`/order/payment/${paymentId}`);
        return response.data;
    }*/

    async getPaymentStatus(paymentId: string): Promise<any> {
        const response = await this.api.patch(`/order/payment-status/${paymentId}`);
        return response.data;
    }

}