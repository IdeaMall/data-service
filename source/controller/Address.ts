import {
    AddressInput,
    AddressListChunk,
    AddressOutput,
    BaseFilter
} from '@ideamall/data-model';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    ForbiddenError,
    Get,
    JsonController,
    NotFoundError,
    OnNull,
    OnUndefined,
    Param,
    Post,
    Put,
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import dataSource, { Address, User } from '../model';

@JsonController('/user/session/address')
export class AddressController {
    store = dataSource.getRepository(Address);

    @Post()
    @Authorized()
    @ResponseSchema(AddressOutput)
    createOne(@Body() data: AddressInput) {
        return this.store.save(Object.assign(new Address(), data));
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(AddressOutput)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() data: AddressInput
    ) {
        const address = await this.store.findOne({ where: { id } });

        if (!address) throw new NotFoundError();

        if (address.createdBy.id !== user.id) throw new ForbiddenError();

        return this.store.save({ ...data, id });
    }

    @Get('/:id')
    @Authorized()
    @OnNull(404)
    @ResponseSchema(AddressOutput)
    getOne(@Param('id') id: number) {
        return this.store.findOne({ where: { id } });
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number, @CurrentUser() user: User) {
        const address = await this.store.findOne({ where: { id } });

        if (!address) throw new NotFoundError();

        if (address.createdBy.id !== user.id) throw new ForbiddenError();

        await this.store.delete(id);
    }

    @Get()
    @Authorized()
    @ResponseSchema(AddressListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.store.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
