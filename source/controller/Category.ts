import {
    CategoryFilter,
    CategoryInput,
    CategoryListChunk,
    CategoryOutput,
    Role
} from '@ideamall/data-model';
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

import dataSource, { Category, User } from '../model';

@JsonController('/category')
export class CategoryController {
    store = dataSource.getRepository(Category);

    @Post()
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(CategoryOutput)
    createOne(@CurrentUser() user: User, @Body() data: CategoryInput) {
        const category = new Category();

        category.createdBy = user;

        return this.store.save(Object.assign(category, data));
    }

    @Put('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(CategoryOutput)
    updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() data: CategoryInput
    ) {
        return this.store.save({ ...data, id, updatedBy: user });
    }

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(CategoryOutput)
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
