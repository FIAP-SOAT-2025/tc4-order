import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PaymentClientInterface } from "src/order/interfaces/clients-interfaces/payment-client.interface";
import { InputPayment, PaymentExternallyResponse } from "src/order/interfaces/responses-interfaces/payment-response.interface";

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
    async createPaymentExternal(data: InputPayment): Promise<PaymentExternallyResponse> {
        console.log("Calling external payment service with data:", data);
        const response = await this.api.post('/payment/checkout', data);
        console.log("External payment service response:", response);
        return response.data;
    }


    async getPaymentStatus(paymentId: string): Promise<PaymentExternallyResponse> {
        const response = await this.api.patch(`/payment-status/${paymentId}`);
        return response.data;
    }

}