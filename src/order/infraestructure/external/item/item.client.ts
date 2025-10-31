import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { ItemClientOrderInterface } from 'src/order/interfaces/item-client.interface';
import { ItemResponse } from 'src/order/interfaces/item-reponse.interface';

@Injectable()
export class ItemClient implements ItemClientOrderInterface {
    private readonly api: AxiosInstance;
    constructor() {
        this.api = axios.create({
            baseURL: process.env.ITEM_SERVICE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    async getItem(id: string): Promise<ItemResponse | null> {
        try {
            const response = await this.api.get(`/item/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching item with id ${id}:`, error);
            return null;
        }
    }
}