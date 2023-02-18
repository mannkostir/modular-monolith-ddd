import {
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { UuidVO } from '@lib/value-objects/uuid.value-object';
import { DateVO } from '@lib/value-objects/date.value-object';
import { AggregateRoot } from '@lib/base/domain/aggregate-root';
import {
  EntityMutationResult,
  IRepository,
} from '@lib/interfaces/ports/repository.interface';
import { OrmMapper } from '@src/infrastructure/database/base/orm-mapper';
import { TypeormUnitOfWork } from '@src/infrastructure/database/base/typeorm.unit-of-work';
import { Result } from '@lib/utils/result.util';
import { PersistenceException } from '@src/infrastructure/database/errors/persistence.exception';
import { MappingPersistenceException } from '@src/infrastructure/database/errors/mapping.persistence.exception';
import { SavingPersistenceException } from '@src/infrastructure/database/errors/saving.persistence.exception';

export type WhereCondition<OrmEntity> =
  | FindOptionsWhere<OrmEntity>[]
  | FindOptionsWhere<OrmEntity>
  | string;

export type WriteQueryParams<EntityProps = Record<string, any>> = {
  ids?: UuidVO[];
  id?: UuidVO;
  createdAt?: DateVO;
  updatedAt?: DateVO;
  createdAfterDate?: DateVO;
  createdBeforeDate?: DateVO;
} & EntityProps;

export abstract class TypeormRepository<
  DomainEntity extends AggregateRoot,
  DomainEntityProps extends Record<string, any>,
  OrmEntity extends { id: string; createdAt: Date; [key: string]: unknown },
  Params extends WriteQueryParams = WriteQueryParams,
> implements IRepository<DomainEntity, DomainEntityProps>
{
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapper<
      DomainEntity,
      DomainEntityProps,
      OrmEntity
    >,
    private readonly unitOfWork: TypeormUnitOfWork,
    private readonly correlationId: string,
  ) {}

  async findOne(params: Params): Promise<DomainEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: this.prepareQuery(params),
    });

    return ormEntity ? this.mapper.toDomainEntity(ormEntity) : null;
  }

  async findOneById(id: UuidVO): Promise<DomainEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: {
        id: id.value,
      } as FindOptionsWhere<OrmEntity>,
    });
    return ormEntity ? this.mapper.toDomainEntity(ormEntity) : null;
  }

  async findManyByIds(ids: UuidVO[]): Promise<DomainEntity[]> {
    const ormEntities = await this.repository.find({
      where: {
        id: In(ids.map((id) => id.value)),
      } as FindOptionsWhere<OrmEntity>,
    });
    return Promise.all(
      (ormEntities || []).map((ormEntity) =>
        this.mapper.toDomainEntity(ormEntity),
      ),
    );
  }

  async findMany(params?: Params): Promise<DomainEntity[]> {
    const options: FindManyOptions<OrmEntity> = params
      ? { where: this.prepareQuery(params) }
      : {};
    const ormEntities = await this.repository.find(options);
    return Promise.all(
      ormEntities.map((ormEntity) => this.mapper.toDomainEntity(ormEntity)),
    );
  }

  async save(
    entity: DomainEntity,
  ): Promise<Result<EntityMutationResult, PersistenceException>> {
    this.unitOfWork.addAggregates(this.correlationId, [entity]);

    const ormEntityMappingResult: Result<
      OrmEntity,
      MappingPersistenceException
    > = await this.mapper
      .toOrmEntity(entity)
      .then((entity) => Result.ok(entity))
      .catch((err) => Result.fail(new MappingPersistenceException(err)));

    if (ormEntityMappingResult.isErr) return ormEntityMappingResult;

    const ormEntity = ormEntityMappingResult.unwrap();

    return this.repository
      .save(ormEntity)
      .then((entity) => Result.ok({ id: new UuidVO(entity.id) }))
      .catch((err) => {
        console.error(err);
        return Result.fail(new SavingPersistenceException(err));
      });
  }

  async saveMany(
    entities: DomainEntity[],
  ): Promise<Result<EntityMutationResult, PersistenceException>[]> {
    this.unitOfWork.addAggregates(this.correlationId, entities);

    const ormEntitiesMappingResult: Result<
      OrmEntity,
      MappingPersistenceException
    >[] = await Promise.all(
      entities.map((entity) =>
        this.mapper
          .toOrmEntity(entity)
          .then((entity) => Result.ok(entity))
          .catch((err) => Result.fail(new MappingPersistenceException(err))),
      ),
    );

    const erroredResults = ormEntitiesMappingResult.filter(
      (result) => result.isErr,
    );
    const successfulResults = ormEntitiesMappingResult.filter(
      (result) => !result.isErr,
    );

    return this.repository
      .save(successfulResults.map((result) => result.unwrap()))
      .then((entities) =>
        entities.map((entity) => Result.ok({ id: new UuidVO(entity.id) })),
      );
  }

  async removeOne(
    entity: DomainEntity,
  ): Promise<Result<EntityMutationResult, PersistenceException>> {
    this.unitOfWork.addAggregates(this.correlationId, [entity]);

    const ormEntityMappingResult: Result<
      OrmEntity,
      MappingPersistenceException
    > = await this.mapper
      .toOrmEntity(entity)
      .then((entity) => Result.ok(entity))
      .catch((err) => Result.fail(new MappingPersistenceException(err)));

    if (ormEntityMappingResult.isErr) return ormEntityMappingResult;

    const ormEntity = ormEntityMappingResult.unwrap();

    return this.repository
      .remove(ormEntity)
      .then((entity) => Result.ok({ id: new UuidVO(entity.id) }))
      .catch((err) => {
        console.error(err);
        return Result.fail(new SavingPersistenceException(err));
      });
  }

  async removeMany(entities: DomainEntity[]): Promise<DomainEntity[]> {
    this.unitOfWork.addAggregates(this.correlationId, entities);
    const ormEntities = await Promise.all(
      entities.map((entity) => this.mapper.toOrmEntity(entity)),
    );
    const result = await this.repository.remove(ormEntities);
    return Promise.all(
      result.map((entity) => this.mapper.toDomainEntity(entity)),
    );
  }

  async doesExist(params: Params): Promise<boolean> {
    return this.repository
      .findOne({
        where: this.prepareQuery(params),
      })
      .then((entity) => Boolean(entity));
  }

  protected prepareQuery(params: Params): FindOptionsWhere<OrmEntity> {
    const where: FindOptionsWhere<OrmEntity> = {};

    if (params.ids?.length) {
      where.id = In(
        params.ids.map((id) => id.value),
      ) as FindOptionsWhereProperty<OrmEntity['id']>;
    }
    if (params.id?.value) {
      where.id = params.id.value as FindOptionsWhereProperty<OrmEntity['id']>;
    }
    if (params.createdBeforeDate) {
      where.createdAt = LessThan(
        params.createdBeforeDate.date,
      ) as FindOptionsWhereProperty<OrmEntity['createdAt']>;
    }
    if (params.createdAfterDate) {
      where.createdAt = MoreThan(
        params.createdAfterDate.date,
      ) as FindOptionsWhereProperty<OrmEntity['createdAt']>;
    }

    return where;
  }
}
