import { IsEmail } from 'class-validator';

export class GetUserRequestDto {
  @IsEmail()
  email?: string;
}
