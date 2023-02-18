import { GenerateTokenRequestDto } from './generate-token.request.dto';
import { Query } from '@lib/base/communication/query';

export class GenerateTokenQuery extends Query<GenerateTokenRequestDto> {}
