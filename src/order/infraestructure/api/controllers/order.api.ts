import { Body, Controller, Get, Param, Patch, Post, HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderController } from 'src/order/controllers/order.controller';
import { OrderDto } from '../dto/order.dto';
import { OrderResponse } from '../dto/orderResponse.dto';
import { OrderStatusEnum } from 'src/order/enums/orderStatus.enum';
import Order from 'src/order/entities/order.entity';
import { PrismaItemRepository } from 'src/item/infraestructure/persistence/prismaItem.repository';
import { PrismaOrderRepository } from '../../persistence/order.repository';
import { PrismaPaymentRepository } from 'src/payments/infrastructure/persistence/prismaPayment.repository';
import { Payment } from 'src/payments/domain/entities/payment.entity';
import { MercadoPagoClient } from 'src/payments/infrastructure/external/mercado-pago/mercado-pago.client';
import { UpdateOrderStatusDto } from '../dto/update-status.dto';
import { BaseException } from 'src/shared/exceptions/exceptions.base';
import { ExceptionMapper } from 'src/shared/exceptions/exception.mapper';
import OrderInterface from 'src/order/interfaces/order.interface';
import { CustomerClient } from '../../external/customer/customer.client';
import GetCustomerByCpf from 'src/order/usecases/customer/getCustomerByCpf.usecase';
import { PaymentClient } from '../../external/payment/payment.client';

@ApiTags('Order')
@Controller('/order')
export class OrderApi {
  constructor(
    private readonly orderRepository: PrismaOrderRepository,
    private readonly itemRepository: PrismaItemRepository,
    private readonly paymentRepository: PrismaPaymentRepository,
    private readonly paymentProvider: MercadoPagoClient,
    private readonly customerClient: CustomerClient,
    private readonly paymentClient: PaymentClient,
  ) {}

  @Post()
  createOrder(
    @Body() createOrderDto: OrderDto,
  ): Promise<{ order: OrderInterface; payment: Payment }> {
    const getCustomerByCpf = new GetCustomerByCpf(this.customerClient);
    return OrderController.createOrder(
      createOrderDto,
      this.orderRepository,
      this.itemRepository,
      this.paymentRepository,
      this.paymentProvider,
      getCustomerByCpf,
      this.paymentClient,
    );
  }

  @Get('/:id')
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
  }
}
