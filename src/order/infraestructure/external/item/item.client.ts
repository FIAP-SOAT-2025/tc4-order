import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { ItemResponse } from 'src/order/interfaces/responses-interfaces/item-reponse.interface';
import { ItemClientInterface } from 'src/order/interfaces/clients-interfaces/item-client.interface';


@Injectable()
export class ItemClient implements ItemClientInterface {
    private readonly api: AxiosInstance;
    constructor() {
        this.api = axios.create({
            baseURL: "http://api-service.tc4-item.svc.cluster.local:8080",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    async getItemExternally(id: string): Promise<ItemResponse | null> {
        try {
            console.log("Chamando serviço externo de itens com ID:", id);
            console.log("URL da API getItemExternally:", this.api.defaults.baseURL); 
            const response = await this.api.get(`/item/${id}`);

            console.log("Resposta do serviço de itens:", response.data);
            if (!response.data) {
                return null;
            }
            return response.data;
        } catch (error) {
            console.error(`Error fetching item with id ${id}:`, JSON.stringify(error));
            throw new Error(`Error fetching item with id ${id} - ${JSON.stringify(error)}`);
        }
    }
    async updateItemQuantityExternally(itemId: string, quantity: number): Promise<void> {
        try {
            console.log("Chamando serviço externo para atualizar quantidade do item:", itemId, quantity); 
            console.log("URL da API updateItemQuantityExternally:", this.api.defaults.baseURL);      
            await this.api.patch(`/item/${itemId}`, { quantity });
        } catch (error) {
            console.error(`Error updating item quantity for id ${itemId}:`, JSON.stringify(error));
            throw new Error(`Error updating item quantity for id ${itemId} - ${JSON.stringify(error)}`);
        }
    }
}    