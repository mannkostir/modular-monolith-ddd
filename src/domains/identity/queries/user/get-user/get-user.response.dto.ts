import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty({ type: 'email' })
  email!: string;
  @ApiProperty({ type: 'uuid' })
  id!: string;
}
