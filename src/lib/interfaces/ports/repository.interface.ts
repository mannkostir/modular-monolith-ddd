import { DeepPartial } from '@lib/types/deep-partial.type';
import { BaseEntityProps } from '@lib/base/domain/entity';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';
import { Result } from '@lib/utils/result.util';
import { PersistenceException } from '@src/infrastructure/database/errors/persistence.exception';

export type QueryParams<EntityProps> = DeepPartial<
  EntityProps & BaseEntityProps
>;

export interface EntityMutationResult {
  id: UuidVO;
}

export interface QueryOptions<SpecificationType extends TypeormSpecification> {
  specifications?: SpecificationType[];
}

export interface Save<Entity> {
  save(
    entity: Entity,
  ): Promise<Result<EntityMutationResult, PersistenceException>>;
}

export interface SaveMany<Entity> {
  saveMany(
    entities: Entity[],
  ): Promise<Result<EntityMutationResult, PersistenceException>[]>;
}

export interface FindOne<Entity, EntityProps> {
  findOne(
    params: QueryParams<EntityProps>,
    options?: QueryOptions<TypeormSpecification>,
  ): Promise<Entity | null>;
}

export interface FindOneById<Entity> {
  findOneById(id: UuidVO): Promise<Entity | null>;
}

export interface FindManyByIds<Entity> {
  findManyByIds(ids: UuidVO[]): Promise<Entity[]>;
}

export interface FindMany<Entity, EntityProps> {
  findMany(params?: QueryParams<EntityProps>): Promise<Entity[]>;
}

export interface RemoveOne<Entity> {
  removeOne(
    entity: Entity,
  ): Promise<Result<EntityMutationResult, PersistenceException>>;
}

export interface RemoveMany<Entity> {
  removeMany(entities: Entity[]): Promise<EntityMutationResult[]>;
}

export interface DoesExist<EntityProps> {
  doesExist(params: QueryParams<EntityProps>): Promise<boolean>;
}

export interface IRepository<Entity, EntityProps>
  extends Save<Entity>,
    SaveMany<Entity>,
    RemoveOne<Entity>,
    RemoveMany<Entity>,
    FindOneById<Entity>,
    FindMany<Entity, EntityProps>,
    FindOne<Entity, EntityProps>,
    FindManyByIds<Entity>,
    DoesExist<Entity> {}
