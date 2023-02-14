import { IQuery } from '@nestjs/cqrs';

export abstract class Query<
  Params extends Record<string, any> = Record<string, any>,
> implements IQuery
{
  public params: Params | undefined;

  constructor(props: Query<Params>) {
    Object.assign(this, props);
  }
}
