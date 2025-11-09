import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaOrderRepository } from './infraestructure/persistence/order.repository';
import { OrderApi } from './infraestructure/api/controllers/order.api';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/shared/infra/prisma.service';
import { CustomerClient } from './infraestructure/external/customer/customer.client';
import { PaymentClient } from './infraestructure/external/payment/payment.client';
import { ItemClient } from './infraestructure/external/item/item.client';
import { CustomerGateway } from './gateways/customer.gateway';
import { PaymentGateway } from './gateways/payment.gateway';
import { ItemGateway } from './gateways/item.gateway';
import { CustomerGatewayInterface } from './interfaces/gateways-interfaces/customer-gateway.interface';
import { PaymentGatewayInterface } from './interfaces/gateways-interfaces/payment-gateway.interface';
import { ItemGatewayInterface } from './interfaces/gateways-interfaces/item-gateway.interface';
import { CustomerClientInterface } from './interfaces/clients-interfaces/customer-client.interface';
import { ItemClientInterface } from './interfaces/clients-interfaces/item-client.interface';
import { PaymentClientInterface } from './interfaces/clients-interfaces/payment-client.interface';
import GetCustomerByCpf from './usecases/customer/getCustomerByCpf.usecase';
import { OrderGateway } from './gateways/order.gateway';
import OrderGatewayInterface from './interfaces/gateways-interfaces/oreder-gateways.interface';
import OrderRepositoryInterface from './interfaces/OrderRepository.interface';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [OrderApi],
  providers: [
    PrismaService,
    PrismaOrderRepository,
    CustomerClient,
    ItemClient,
    PaymentClient,
    CustomerGateway,
    PaymentGateway,
    ItemGateway,
    OrderGateway,
    GetCustomerByCpf,
    {
      provide: 'CustomerClientInterface',
      useExisting: CustomerClient,
    },
    {
      provide: 'ItemClientInterface',
      useExisting: ItemClient,
    },
    {
      provide: 'PaymentClientInterface',
      useExisting: PaymentClient,
    },
    {
      provide: 'CustomerGatewayInterface',
      useExisting: CustomerGateway,
    },
    {
      provide: 'PaymentGatewayInterface', 
      useExisting: PaymentGateway,
    },
    {
      provide: 'ItemGatewayInterface',
      useExisting: ItemGateway,
    },
    {
      provide: 'OrderRepositoryInterface',
      useExisting: PrismaOrderRepository,
    },
    {
      provide: 'OrderGatewayInterface',
      useExisting: OrderGateway,
    },
  ],
  exports: [],
})
export class OrderModule {}
