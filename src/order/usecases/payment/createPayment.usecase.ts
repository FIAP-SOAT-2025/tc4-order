import { PaymentClientInterface } from "src/order/interfaces/payment-client.interface";
import { PaymentTypeEnum } from "src/order/entities/payment/enum/payment-type.enum";
import { Payment, PaymentStatusEnum } from "src/order/entities/payment/payment.entity";
import { PaymentGatewayInterface } from "src/payments/interfaces/payment-gateway.interface";

export class CreatePaymentUseCase  {
  constructor(
    private readonly paymentClient: PaymentClientInterface,
    private readonly paymentGateway: PaymentGatewayInterface
  ) {}

  async createPayment(
    email: string,
    orderId: string,
    totalAmount: number
  ): Promise<Payment> {

    const provideResponse = await this.paymentClient.createPaymentExternal({
      email,
      orderId,
      totalAmount
    });
    const paymentId = String(provideResponse.id);
    const qrCode = provideResponse.point_of_interaction?.transaction_data?.qr_code;
    const status = (provideResponse.status.toUpperCase() as PaymentStatusEnum);
    const type = PaymentTypeEnum.PIX;

    return this.paymentGateway.create( orderId, type, status, paymentId, qrCode);
  }
}
