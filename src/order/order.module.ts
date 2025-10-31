import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaOrderRepository } from './infraestructure/persistence/order.repository';
import { OrderApi } from './infraestructure/api/controllers/order.api';
import { PrismaPaymentRepository } from 'src/payments/infrastructure/persistence/prismaPayment.repository';
import { MercadoPagoClient } from 'src/payments/infrastructure/external/mercado-pago/mercado-pago.client';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/shared/infra/prisma.service';
import { PrismaItemRepository } from 'src/item/infraestructure/persistence/prismaItem.repository';
import { CustomerClient } from './infraestructure/external/customer/customer.client';
import { PaymentClient } from './infraestructure/external/payment/payment.client';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [OrderApi],
  providers: [
    PrismaService,
    PrismaPaymentRepository,
    PrismaOrderRepository,
    PrismaItemRepository,
    MercadoPagoClient,
    CustomerClient,
    PaymentClient,
  ],
  exports: [],
})
export class OrderModule {}
