import type {} from 'koa2-swagger-ui';
import { createAPI } from 'koagger';

import { isProduct } from '../utility';
import { BaseController } from './Base';
import { BuyerAddressController, SellerAddressController } from './Address';
import { CategoryController } from './Category';
import { FileController } from './File';
import { GoodsController } from './Goods';
import { SessionController } from './Session';
import { StatisticController } from './Statistic';
import { UserController } from './User';

export * from './Base';
export * from './Statistic';
export * from './File';
export * from './User';
export * from './Session';
export * from './Address';
export * from './Category';
export * from './Goods';

export const controllers = [
    StatisticController,
    FileController,
    BuyerAddressController,
    SessionController,
    UserController,
    // AddressController,
    CategoryController,
    SellerAddressController,
    GoodsController,
    // FavoriteController,
    // OrderController,
    // CommentController
    BaseController
];

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers
});
