import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { ItemResponse } from 'src/order/interfaces/responses-interfaces/item-reponse.interface';
import { ItemClientInterface } from 'src/order/interfaces/clients-interfaces/item-client.interface';


@Injectable()
export class ItemClient implements ItemClientInterface {
    private readonly api: AxiosInstance;
    constructor() {
        this.api = axios.create({
            baseURL: process.env.ITEM_SERVICE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    async getItemExternally(id: string): Promise<ItemResponse | null> {
        try {
            console.log("Chamando serviço externo de itens com ID:", id);

            const response = await this.api.get(`/order/item/${id}`);

            console.log("Resposta do serviço de itens:", response.data);
            if (!response.data) {
                return null;
            }
            return response.data;
        } catch (error) {
            console.error(`Error fetching item with id ${id}:`, error);
            return null;
        }
    }
}