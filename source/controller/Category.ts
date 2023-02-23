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

import dataSource, { Category } from '../model';

@JsonController('/category')
export class CategoryController {
    store = dataSource.getRepository(Category);

    @Post()
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(CategoryOutput)
    createOne(@Body() data: CategoryInput) {
        return this.store.save(Object.assign(new Category(), data));
    }

    @Put('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(CategoryOutput)
    updateOne(@Param('id') id: number, @Body() data: CategoryInput) {
        return this.store.save({ ...data, id });
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
    async getList(@QueryParams() { pageSize, pageIndex }: CategoryFilter) {
        const [list, count] = await this.store.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
