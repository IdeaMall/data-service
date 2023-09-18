import { ConnectionOptions, parse } from 'pg-connection-string';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

import { DATABASE_URL, isProduct } from '../utility';
import { Address } from './Address';
import { Category } from './Category';
import { Comment } from './Comment';
import { Favorite } from './Favorite';
import { Goods } from './Goods';
import { GoodsItem } from './GoodsItem';
import { Order } from './Order';
import { Parcel } from './Parcel';
import { User } from './User';

export * from './Address';
export * from './Base';
export * from './Category';
export * from './Comment';
export * from './Favorite';
export * from './File';
export * from './Goods';
export * from './GoodsItem';
export * from './Order';
export * from './Parcel';
export * from './Statistic';
export * from './User';

const { ssl, host, port, user, password, database } = isProduct
    ? parse(DATABASE_URL)
    : ({} as ConnectionOptions);

const commonOptions: Pick<
    SqliteConnectionOptions,
    'synchronize' | 'entities' | 'migrations'
> = {
    synchronize: true,
    entities: [
        User,
        Address,
        Category,
        Goods,
        GoodsItem,
        Favorite,
        Order,
        Parcel,
        Comment
    ],
    migrations: [`${isProduct ? '.data' : 'migration'}/*.ts`]
};

export const dataSource = isProduct
    ? new DataSource({
          type: 'postgres',
          ssl: ssl as boolean,
          host,
          port: +port,
          username: user,
          password,
          database,
          logging: true,
          ...commonOptions
      })
    : new DataSource({
          type: 'sqlite',
          database: '.data/test.db',
          logging: false,
          ...commonOptions
      });
