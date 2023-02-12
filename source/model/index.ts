import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { ConnectionOptions, parse } from 'pg-connection-string';

import { User } from './User';
import { Address } from './Address';
import { Category } from './Category';
import { Goods } from './Goods';
import { GoodsItem } from './GoodsItem';
import { Favorite } from './Favorite';
import { Order } from './Order';
import { Parcel } from './Parcel';
import { Comment } from './Comment';

export * from './Base';
export * from './User';
export * from './Address';
export * from './Category';
export * from './Goods';
export * from './GoodsItem';
export * from './Favorite';
export * from './Order';
export * from './Parcel';
export * from './Comment';

const { NODE_ENV, DATABASE_URL } = process.env;

export const isProduct = NODE_ENV === 'production';

const { host, port, user, password, database } = isProduct
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

export default isProduct
    ? new DataSource({
          type: 'postgres',
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
