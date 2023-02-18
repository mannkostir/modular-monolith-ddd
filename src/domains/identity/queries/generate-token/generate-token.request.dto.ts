import { IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTokenRequestDto {
  @IsEmail()
  @ApiProperty()
  email!: string;

  @IsUUID()
  @ApiProperty()
  userId!: string;
}
