import { Body, Controller, Get, Param, Patch, Post, HttpException, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderController } from 'src/order/controllers/order.controller';
import { OrderDto } from '../dto/order.dto';
//import { OrderResponse } from '../dto/orderResponse.dto';
//import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
//import Order from 'src/order/entities/order.entity';
import { PrismaOrderRepository } from '../../persistence/order.repository';
/*import { UpdateOrderStatusDto } from '../dto/update-status.dto';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { ExceptionMapper } from 'src/shared/exceptions/exception.mapper';*/
import OrderInterface from 'src/order/interfaces/order.interface';
import { CustomerClient } from '../../external/customer/customer.client';
import GetCustomerByCpf from 'src/order/usecases/customer/getCustomerByCpf.usecase';
import { PaymentClient } from '../../external/payment/payment.client';
import { InputPayment, PaymentExternallyResponse } from 'src/order/interfaces/responses-interfaces/payment-response.interface';
import { ItemGatewayInterface } from 'src/order/interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentGatewayInterface } from 'src/order/interfaces/gateways-interfaces/payment-gateway.interface';
import { CustomerGatewayInterface } from 'src/order/interfaces/gateways-interfaces/customer-gateway.interface';
import { ItemResponse } from 'src/order/interfaces/responses-interfaces/item-reponse.interface';
import { CustomerResponse } from 'mercadopago/dist/clients/customer/commonTypes';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';

@ApiTags('Order')
@Controller('/order')
export class OrderApi {
  constructor(
    private readonly orderRepository: PrismaOrderRepository,
    @Inject('CustomerGatewayInterface') private readonly customerGateway: CustomerGatewayInterface,
    @Inject('ItemGatewayInterface') private readonly itemGateway: ItemGatewayInterface,
    @Inject('PaymentGatewayInterface') private readonly paymentGateway: PaymentGatewayInterface,
    private readonly getCustomerByCpf: GetCustomerByCpf,
  ) {}

  @Post()
  createOrder(
    @Body() createOrderDto: OrderDto,
  ): Promise<{ order: OrderInterface; payment: PaymentExternallyResponse }> {
    console.log("Creating order with DTO:", createOrderDto);
    return OrderController.createOrder(
      createOrderDto,
      this.orderRepository,
      this.getCustomerByCpf,
      this.itemGateway,
      this.paymentGateway,
    );
  }

   @Get('/item/:id')
   getItem(@Param('id') id: string): ItemResponse | null {
     console.log(`Entrei controller na rota de buscar item ID: ${id}`);
     const item: ItemResponse = {
       id: '550e8400-e29b-41d4-a716-446655440000',
       quantity: 100,
       price: 22.90,
     };

     return item;
   }

   @Get('/customer/cpf/:cpf')
   getCustomerByCpfEndpoint(@Param('cpf') cpf: string): CustomerExternallyResponse | null {
     console.log(`Entrei controller na rota de buscar CPF: ${cpf}`);
     const customer: CustomerExternallyResponse = {
       id: '1f228665-4e55-4f0c-9537-da3ea7980511',
       email: 'john.doe@example.com'
     };

     return customer;
   }

   @Post('/payment/checkout')
   createPayment(@Body() paymentDto: InputPayment): PaymentExternallyResponse {
     console.log(`Entrei controller na rota de criar pagamento:`, paymentDto);
     const payment: PaymentExternallyResponse = {
       paymentId: '123',
       status: 'approved',
     };
     return payment;
   }

  /*@Get('/:id')
  find(@Param('id') id: string): Promise<Order> {
    return OrderController.find(id, this.orderRepository);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return OrderController.findAll(this.orderRepository);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() statusDto: UpdateOrderStatusDto) {
      console.log(`API Updating order status for ID: ${id} to ${statusDto}`);
      try {
      return await OrderController.updateStatus(
        id,
        statusDto.status,
        this.orderRepository,
        this.itemRepository,
      );
    } catch (error) {
      console.log('Error updating order status:', error);
      throw ExceptionMapper.mapToHttpException(error as BaseException);
    }
  }*/
}
