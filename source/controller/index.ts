import { createAPI } from 'koagger';

import { isProduct } from '../model';
import { AddressController } from './Address';
import { CategoryController } from './Category';
import { CommentController } from './Comment';
import { FavoriteController } from './Favorite';
import { GoodsController } from './Goods';
import { OrderController } from './Order';
import { UserController } from './User';

export * from './User';

export const { swagger, mocker, router } = createAPI({
    mock: !isProduct,
    controllers: [
        UserController,
        AddressController,
        CategoryController,
        GoodsController,
        FavoriteController,
        OrderController,
        CommentController
    ]
});
