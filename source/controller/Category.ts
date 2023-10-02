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
    Category,
    CategoryFilter,
    CategoryListChunk,
    Role,
    User,
    dataSource
} from '../model';

@JsonController('/category')
export class CategoryController {
    store = dataSource.getRepository(Category);

    @Post()
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(Category)
    createOne(@CurrentUser() user: User, @Body() data: Category) {
        const category = new Category();

        category.createdBy = user;

        return this.store.save(Object.assign(category, data));
    }

    @Put('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(Category)
    updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() data: Category
    ) {
        return this.store.save({ ...data, id, updatedBy: user });
    }

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(Category)
    getOne(@Param('id') id: number) {
        return this.store.findOne({ where: { id } });
    }

    @Delete('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number) {
        await this.store.delete(id);
    }

    @Get()
    @ResponseSchema(CategoryListChunk)
    async getList(
        @QueryParams() { parentId, pageSize, pageIndex }: CategoryFilter
    ) {
        const [list, count] = await this.store.findAndCount({
            where: parentId && { parentId },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
