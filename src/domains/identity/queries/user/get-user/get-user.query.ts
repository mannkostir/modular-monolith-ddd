import { Query } from '@lib/base/communication/query';
import { GetUserRequestDto } from './get-user.request.dto';

export class GetUserQuery extends Query<
  GetUserRequestDto & { userId?: string }
> {}
