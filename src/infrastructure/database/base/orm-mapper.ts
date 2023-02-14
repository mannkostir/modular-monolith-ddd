import { EntityManager } from 'typeorm';
import { UuidVO, UuidVOFactory } from '@lib/value-objects/uuid.value-object';
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
  EntityBase extends Entity<Record<string, unknown>>,
  EntityProps extends Record<string, any>,
  OrmEntity,
> implements IOrmMapper<EntityBase, OrmEntity>
{
  protected manager: EntityManager | undefined;

  constructor(manager?: EntityManager) {
    this.manager = manager;
  }

  //final
  public async toDomainEntity(ormEntity: OrmEntity): Promise<EntityBase> {
    const props = await this.toDomainProps(ormEntity);
    const entity = ormEntity as unknown as TypeormEntity;

    const constructor = this.getEntityConstructor(ormEntity);
    return new constructor({
      id: new UuidVOFactory().create(this.getEntityId(ormEntity, props)),
      props,
      createdAt: new DateVOFactory().create(entity.createdAt),
      updatedAt: new DateVOFactory().create(entity.updatedAt),
    });
  }

  //final
  public async toOrmEntity(entity: EntityBase): Promise<OrmEntity> {
    const props = await this.toOrmProps(entity);
    const constructor = this.getOrmEntityConstructor(entity);
    return new constructor({
      ...props,
      id: this.getOrmEntityId(entity, props),
      createdAt: entity.createdAt.ISOString,
      updatedAt: entity.updatedAt.ISOString,
    });
  }

  protected abstract getEntityConstructor(
    ormEntity: OrmEntity,
  ): new (props: any) => EntityBase;

  protected abstract getOrmEntityConstructor(
    entity: EntityBase,
  ): new (props: any) => OrmEntity;

  protected getEntityId(ormEntity: OrmEntity, props: EntityProps) {
    return (ormEntity as unknown as TypeormEntity).id;
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
