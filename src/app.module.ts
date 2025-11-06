import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './shared/infra/prisma.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    OrderModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
