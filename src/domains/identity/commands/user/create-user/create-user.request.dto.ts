import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @IsEmail()
  @ApiProperty()
  email!: string;
  @IsString()
  @ApiProperty()
  password!: string;
}
