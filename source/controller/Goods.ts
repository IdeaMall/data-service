import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    Get,
    JsonController,
    OnNull,
    OnUndefined,
    Param,
    Post,
    Put,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import {
    Address,
    Category,
    Goods,
    GoodsFilter,
    GoodsItem,
    GoodsItemFilter,
    GoodsItemListChunk,
    GoodsListChunk,
    Role,
    User,
    dataSource
} from '../model';

@JsonController('/goods')
export class GoodsController {
    goodsStore = dataSource.getRepository(Goods);
    itemStore = dataSource.getRepository(GoodsItem);

    @Post('/:id/item')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(GoodsItem)
    createOneItem(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() { goods, ...data }: GoodsItem
    ) {
        const goodsItem = new GoodsItem();

        goodsItem.createdBy = user;
        goodsItem.goods = Object.assign(new Goods(), { id });

        return this.itemStore.save(Object.assign(goodsItem, data));
    }

    @Put('/:goods/item/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(GoodsItem)
    updateOneItem(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() { goods, ...data }: GoodsItem
    ) {
        return this.itemStore.save({
            ...data,
            id,
            updatedBy: user,
            goods: Object.assign(new Goods(), { id: goods })
        });
    }

    @Get('/:goods/item/:id')
    @OnNull(404)
    @ResponseSchema(GoodsItem)
    getOneItem(@Param('id') id: number) {
        return this.itemStore.findOne({ where: { id } });
    }

    @Delete('/:goods/item/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @OnUndefined(204)
    async deleteOneItem(@Param('id') id: number) {
        await this.itemStore.delete(id);
    }

    @Get('/:id/item')
    @ResponseSchema(GoodsItemListChunk)
    async getItemList(
        @Param('id') id: number,
        @QueryParams() { pageSize, pageIndex }: GoodsItemFilter
    ) {
        const [list, count] = await this.itemStore.findAndCount({
            where: { goods: { id } },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }

    @Post()
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(Goods)
    createOne(
        @CurrentUser() user: User,
        @Body() { category, items, store, ...data }: Goods
    ) {
        const goods = new Goods();

        goods.createdBy = user;

        goods.category = Object.assign(new Category(), { id: category });

        if (items)
            goods.items = items.map(id =>
                Object.assign(new GoodsItem(), { id })
            );
        goods.store = Object.assign(new Address(), { id: store });

        return this.goodsStore.save(Object.assign(goods, data));
    }

    @Put('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(Goods)
    updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() { category, items, store, ...data }: Goods
    ) {
        return this.goodsStore.save({
            ...data,
            id,
            updatedBy: user,
            category: Object.assign(new Category(), { id: category }),
            items: items?.map(id => Object.assign(new GoodsItem(), { id })),
            store: Object.assign(new Address(), { id: store })
        });
    }

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(Goods)
    getOne(@Param('id') id: number) {
        return this.goodsStore.findOne({
            where: { id },
            relations: ['category', 'store']
        });
    }

    @Delete('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number) {
        await this.goodsStore.delete(id);
    }

    @Get()
    @ResponseSchema(GoodsListChunk)
    async getList(
        @QueryParams() { category, store, pageSize, pageIndex }: GoodsFilter
    ) {
        const [list, count] = await this.goodsStore.findAndCount({
            where: (category || store) && {
                category: category && { id: category },
                store: store && { id: store }
            },
            relations: ['category', 'store'],
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
