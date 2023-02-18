import { ApiProperty } from '@nestjs/swagger';
import { EntityId } from '@lib/communication/gateway-interface/api-types/entity-id.api-type';

export class CreateOrderResponseDto implements EntityId {
  @ApiProperty({ type: 'uuid' })
  id!: string;
}
