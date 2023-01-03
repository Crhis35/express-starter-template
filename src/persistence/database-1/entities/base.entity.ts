import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class CoreEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'timestamptz' })
  createdAt = new Date();

  @Property({ type: 'timestamptz', onUpdate: () => new Date() })
  updatedAt = new Date();
}
