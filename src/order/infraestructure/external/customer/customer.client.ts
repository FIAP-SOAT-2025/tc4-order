import axios, { AxiosInstance } from 'axios';
import { Injectable, } from '@nestjs/common';
import { Customer } from "../../../entities/customer/customer.entity";
import { CustomerClientOrderInterface } from "src/order/interfaces/customer-client.interface";

@Injectable()
export class CustomerClient implements CustomerClientOrderInterface {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.CUSTOMER_SERVICE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async findByCpf(cpf: string): Promise<Customer | null> {
    try {
      const response = await this.api.get(`/customer/cpf/${cpf}`);
      
      console.log("Resposta do serviço de clientes:", response.data);
      
      if (!response.data) {
        return null;
      }
      
      return new Customer(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      
      console.error('Error calling customer service:', error);
      throw new Error('Failed to fetch customer from external service');
    }
  }
}