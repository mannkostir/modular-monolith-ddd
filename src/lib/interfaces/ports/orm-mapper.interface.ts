export interface IOrmMapper<Entity, OrmEntity> {
  toDomainEntity(ormEntity: OrmEntity): Promise<Entity>;

  toOrmEntity(entity: Entity): Promise<OrmEntity>;
}
