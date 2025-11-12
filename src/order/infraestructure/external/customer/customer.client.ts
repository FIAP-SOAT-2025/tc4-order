import axios, { AxiosInstance } from 'axios';
import { Injectable, } from '@nestjs/common';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';
import { CustomerClientInterface } from 'src/order/interfaces/clients-interfaces/customer-client.interface';

@Injectable()
export class CustomerClient implements CustomerClientInterface {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.CUSTOMER_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async findByCpfExternally(cpf: string): Promise<CustomerExternallyResponse | null> {
    try {
      console.log("Chamando serviço externo de clientes com CPF:", cpf);
      console.log("URL do serviço de clientes:", this.api.defaults.baseURL);
      const response = await this.api.get(`/customer/cpf/${cpf}`);
      
      console.log("Resposta do serviço de clientes:", response.data);
      
      if (!response.data) {
        return null;
      }

      return response.data;
    } catch (error: any) {
      console.log("Erro ao chamar serviço externo de clientes:", error.message);
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('Error calling customer service:', error);
      throw new Error('Failed to fetch customer from external service');
    }
  }
}