import { createAPI } from 'koagger';

import { isProduct } from '../model';
import { AddressController } from './Address';
import { CategoryController } from './Category';
import { CommentController } from './Comment';
import { FavoriteController } from './Favorite';
import { GoodsController } from './Goods';
import { OrderController } from './Order';
import { StatisticController } from './Statistic';
import { UserController } from './User';

export * from './Statistic';
export * from './User';

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers: [
        UserController,
        // AddressController,
        // CategoryController,
        // GoodsController,
        // FavoriteController,
        // OrderController,
        // CommentController
        StatisticController
    ]
});
