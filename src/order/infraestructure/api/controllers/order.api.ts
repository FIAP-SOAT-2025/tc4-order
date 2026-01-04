import { Body, Controller, Get, Param, Patch, Post, HttpException, Inject, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderController } from 'src/order/controllers/order.controller';
import { OrderDto } from '../dto/order.dto';
import { OrderResponse } from '../dto/orderResponse.dto';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import Order from 'src/order/entities/order.entity';
import { PrismaOrderRepository } from '../../persistence/order.repository';
import { UpdateOrderStatusDto } from '../dto/update-status.dto';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { ExceptionMapper } from 'src/shared/exceptions/exception.mapper';
import OrderInterface from 'src/order/interfaces/order.interface';
import GetCustomerByCpf from 'src/order/usecases/customer/getCustomerByCpf.usecase';
import { InputPayment, PaymentExternallyResponse } from 'src/order/interfaces/responses-interfaces/payment-response.interface';
import { ItemGatewayInterface } from 'src/order/interfaces/gateways-interfaces/item-gateway.interface';
import { PaymentGatewayInterface } from 'src/order/interfaces/gateways-interfaces/payment-gateway.interface';
import { ItemResponse } from 'src/order/interfaces/responses-interfaces/item-reponse.interface';
import { CustomerExternallyResponse } from 'src/order/interfaces/responses-interfaces/customer-externally-response.interface';

@ApiTags('Order')
@Controller('/order')
export class OrderApi {
  constructor(
    private readonly orderRepository: PrismaOrderRepository,
    @Inject('ItemGatewayInterface') private readonly itemGateway: ItemGatewayInterface,
    @Inject('PaymentGatewayInterface') private readonly paymentGateway: PaymentGatewayInterface,
    private readonly getCustomerByCpf: GetCustomerByCpf,
  ) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: OrderDto,
  ): Promise<{ order: OrderInterface; payment: PaymentExternallyResponse }> {
    console.log("15:21:: Creating order Controller API Route with DTO:", createOrderDto);
    return await OrderController.createOrder(
      createOrderDto,
      this.orderRepository,
      this.getCustomerByCpf,
      this.itemGateway,
      this.paymentGateway,
    );
  }

    @Get('/:id')
  find(@Param('id') id: string): Promise<Order> {
    console.log(`Entrei controller na rota de buscar order por ID: ${id}`);
    return OrderController.find(id, this.orderRepository);
  }

  @Get()
  findAll(): Promise<Order[]> {
      console.log(`Entrei controller na rota de buscar todas as orders::1521 ::this.orderRepository::: ${this.orderRepository}`);
      
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
        this.itemGateway
      );
    } catch (error) {
      console.log('Error updating order status:', error);
      throw ExceptionMapper.mapToHttpException(error as BaseException);
    }
  }

}
