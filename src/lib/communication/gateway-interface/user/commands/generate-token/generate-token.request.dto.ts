import { IsEmail, IsUUID } from 'class-validator';

export class GenerateTokenRequestDto {
  @IsEmail()
  email!: string;

  @IsUUID()
  userId!: string;
}
