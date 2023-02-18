
import { Command } from '@lib/base/communication/command';
import { GenerateTokenRequestDto } from './generate-token.request.dto';

export class GenerateTokenCommand extends Command<GenerateTokenRequestDto> {}
