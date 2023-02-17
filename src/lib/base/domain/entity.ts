import { DomainRulesChecker } from '@lib/base/domain/domain.rules-checker';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { DateVO, DateVOFactory } from '@lib/value-objects/date.value-object';

export interface BaseEntityProps {
  id: UuidVO;
  createdAt?: DateVO;
  updatedAt?: DateVO;
}

export type EntityProps<RequiredProps, OptionalProps> =
  Required<RequiredProps> & Partial<OptionalProps>;

export interface CreateEntityProps<T> extends Partial<BaseEntityProps> {
  props: T;
}

export abstract class Entity<Props extends object> {
  protected readonly rulesChecker: DomainRulesChecker;
  protected readonly _id: UuidVO;
  protected readonly props: Props;
  private readonly _createdAt: DateVO;

  constructor({ id, props, createdAt, updatedAt }: CreateEntityProps<Props>) {
    this._id = id ? id : UuidVO.generate();

    const now = new DateVOFactory().now;

    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;

    this.rulesChecker = new DomainRulesChecker(props);
  }

  private _updatedAt: DateVO;

  public get updatedAt(): DateVO {
    return this._updatedAt;
  }

  public get id(): UuidVO {
    return this._id;
  }

  public get createdAt(): DateVO {
    return this._createdAt;
  }

  public getCopiedProps(): Props & BaseEntityProps {
    const copiedProps: Props & BaseEntityProps = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };

    return Object.freeze(copiedProps);
  }
}
