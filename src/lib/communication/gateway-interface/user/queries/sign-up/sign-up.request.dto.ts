import { IsEmail } from 'class-validator';

export class SignUpRequestDto {
  @IsEmail()
  email?: string;
}
