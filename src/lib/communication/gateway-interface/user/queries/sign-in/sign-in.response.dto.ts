import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  token!: string;
}
