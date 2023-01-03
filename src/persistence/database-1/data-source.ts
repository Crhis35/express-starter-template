import { environment } from '../../config';
import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core';

import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { User } from './entities';

const dbKey = 'database-1';
const config = environment.databases.find(db => db.key === dbKey);

delete config['key'];

export const dbOptions: Options = {
  ...config,
  highlighter: new SqlHighlighter(),
  entities: [User],
  debug: environment.nodeEnv === 'development' ? true : false,
  // driverOptions: {
  //   connection: { ssl: { rejectUnauthorized: false } },
  // },
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
};
