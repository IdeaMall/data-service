import { createAPI } from 'koagger';

import { isProduct } from '../model';
import { AddressController } from './Address';
import { CategoryController } from './Category';
import { CommentController } from './Comment';
import { FavoriteController } from './Favorite';
import { FileController } from './File';
import { GoodsController } from './Goods';
import { OrderController } from './Order';
import { SessionController } from './Session';
import { StatisticController } from './Statistic';
import { UserController } from './User';

export * from './Statistic';
export * from './File';
export * from './User';
export * from './Session';
export * from './Address';
export * from './Category';

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers: [
        StatisticController,
        FileController,
        AddressController,
        SessionController,
        UserController,
        // AddressController,
        CategoryController
        // GoodsController,
        // FavoriteController,
        // OrderController,
        // CommentController
    ]
});
