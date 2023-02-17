
import { Command } from '@lib/base/communication/command';
import { CreateUserRequestDto } from './create-user.request.dto';

export class CreateUserCommand extends Command<CreateUserRequestDto> {}
