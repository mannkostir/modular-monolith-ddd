import { DataSource } from 'typeorm';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { Entity } from '@lib/base/domain/entity';
import { IOrmMapper } from '@lib/interfaces/ports/orm-mapper.interface';
import { TypeormEntity } from '@src/infrastructure/database/types/typeorm-entity.type';
import { DateVOFactory } from '@lib/value-objects/date.value-object';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';

export interface EntityProps<EntityProps> {
  id: UuidVO;
  props: EntityProps;
}

export abstract class OrmMapper<
  EntityBase extends Entity<object>,
  EntityProps extends Record<string, any>,
  OrmEntity,
> implements IOrmMapper<EntityBase, OrmEntity>
{
  protected dataSource: DataSource | undefined;

  constructor(dataSource?: DataSource) {
    this.dataSource = dataSource;
  }

  public async toDomainEntity(ormEntity: OrmEntity): Promise<EntityBase> {
    const props = await this.toDomainProps(ormEntity);
    const entity = ormEntity as TypeormEntity;

    const constructor = this.getEntityConstructor(ormEntity);
    return new constructor({
      id: new UuidVO(this.getEntityId(ormEntity, props)),
      props,
      createdAt: new DateVOFactory().create(entity.createdAt),
      updatedAt: new DateVOFactory().create(entity.updatedAt),
    });
  }

  public async toOrmEntity(entity: EntityBase): Promise<OrmEntity> {
    const props = await this.toOrmProps(entity);
    return {
      ...props,
      id: this.getOrmEntityId(entity, props),
      createdAt: entity.createdAt.ISOString,
      updatedAt: entity.updatedAt.ISOString,
    } as OrmEntity;
  }

  protected abstract getEntityConstructor(
    ormEntity: OrmEntity,
  ): new (props: any) => EntityBase;

  protected getEntityId(ormEntity: OrmEntity, props: EntityProps) {
    return (ormEntity as TypeormEntity).id;
  }

  protected getOrmEntityId(
    entity: EntityBase,
    props: OrmEntityProps<OrmEntity>,
  ) {
    return entity.id.value;
  }

  protected abstract toDomainProps(ormEntity: OrmEntity): Promise<EntityProps>;

  protected abstract toOrmProps(
    entity: EntityBase,
  ): Promise<OrmEntityProps<OrmEntity>>;
}
