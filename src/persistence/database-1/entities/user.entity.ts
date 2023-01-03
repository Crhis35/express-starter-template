import { Entity, Property } from '@mikro-orm/core';
import { CoreEntity } from './base.entity';

@Entity()
export class User extends CoreEntity {
  @Property({ unique: true })
  email: string;

  @Property()
  name: string;
}
