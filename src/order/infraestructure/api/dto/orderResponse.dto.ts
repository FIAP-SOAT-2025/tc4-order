import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  customerId?: string | null;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}

export class OrderItemResponse {
  @ApiProperty()
  itemId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}
export class CompleteOrderResponse extends OrderResponse {
  @ApiProperty({ type: [OrderItemResponse] })
  orderItems: OrderItemResponse;

}