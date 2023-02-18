import { User } from '@lib/communication/gateway-interface/api-types/user.api-type';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto implements User {
  @ApiProperty({ type: 'email' })
  email!: string;
  @ApiProperty({ type: 'uuid' })
  id!: string;
}
