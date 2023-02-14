import { DeepPartial } from '@lib/types/deep-partial.type';
import { BaseEntityProps } from '@lib/base/domain/entity';
import { EntityNotFoundDomainError } from '@lib/errors/entity-not-found.domain.exception';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { Result } from '@lib/utils/result.util';
import { PaginationQuery } from '@lib/interfaces/common/pagination-query.interface';
import { PaginatedResponse } from '@lib/base/common/paginated.response';
import { OrmEntityProps } from '@src/infrastructure/database/types/orm-entity-props.type';
import { TypeormSpecification } from '@src/infrastructure/database/base/typeorm.specification';

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
  save(entity: Entity): Promise<EntityMutationResult>;
}

export interface SaveMany<Entity> {
  saveMany(entities: Entity[]): Promise<EntityMutationResult[]>;
}

export interface FindOne<Entity, EntityProps> {
  findOne(
    params: QueryParams<EntityProps>,
    options?: QueryOptions<TypeormSpecification>,
  ): Promise<Entity> | undefined;
}

export interface FindOneById<Entity> {
  findOneById(id: UuidVO): Promise<Entity>;
}

export interface FindManyByIds<Entity> {
  findManyByIds(ids: UuidVO[]): Promise<Entity[]>;
}

export interface FindOneOrThrow<Entity, EntityProps> {
  findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity>;
}

export interface FindOneOrThrowResult<Entity, EntityProps> {
  findOneOrThrowResult(
    params: QueryParams<EntityProps>,
  ): Promise<Result<Entity, EntityNotFoundDomainError>>;
}

export interface FindMany<Entity, EntityProps> {
  findMany(params?: QueryParams<EntityProps>): Promise<Entity[]>;
}

export interface FindManyPaginated<Entity, EntityProps> {
  findManyPaginated(
    params: QueryParams<EntityProps> & PaginationQuery,
  ): Promise<PaginatedResponse<Entity>>;
}

export interface RemoveOne<Entity> {
  removeOne(entity: Entity): Promise<EntityMutationResult>;
}

export interface RemoveMany<Entity> {
  removeMany(entities: Entity[]): Promise<EntityMutationResult[]>;
}

export interface DoesExist<EntityProps> {
  doesExist(params: QueryParams<EntityProps>): Promise<boolean>;
}

export interface DoesExistById {
  doesExist(id: UuidVO): Promise<boolean>;
}

export interface ReadRepositoryPort<Model>
  extends FindOne<Model, OrmEntityProps<Model>>,
    FindMany<Model, OrmEntityProps<Model>>,
    FindOneById<Model>,
    FindManyByIds<Model>,
    FindManyPaginated<Model, OrmEntityProps<Model>>,
    FindOneOrThrow<Model, OrmEntityProps<Model>>,
    DoesExist<OrmEntityProps<Model>> {}

export interface WriteRepositoryInterface<Entity>
  extends Save<Entity>,
    SaveMany<Entity>,
    RemoveOne<Entity>,
    RemoveMany<Entity>,
    FindOneById<Entity>,
    FindManyByIds<Entity>,
    DoesExistById {}

export interface RepositoryInterface<Entity, EntityProps>
  extends FindOne<Entity, EntityProps>,
    FindMany<Entity, EntityProps>,
    Save<Entity>,
    SaveMany<Entity>,
    RemoveOne<Entity>,
    RemoveMany<Entity>,
    FindOneById<Entity>,
    FindManyByIds<Entity>,
    FindManyPaginated<Entity, EntityProps>,
    FindOneOrThrowResult<Entity, EntityProps>,
    FindOneOrThrow<Entity, EntityProps>,
    DoesExist<EntityProps> {}
