import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
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

import {
    dataSource,
    Address,
    User,
    AddressOwner,
    BaseFilter,
    AddressListChunk,
    Role
} from '../model';

@JsonController('/user/session/address')
export class BuyerAddressController {
    store = dataSource.getRepository(Address);

    @Post()
    @Authorized()
    @ResponseSchema(Address)
    createOne(@CurrentUser() user: User, @Body() data: Address) {
        const address = new Address();

        address.createdBy = user;

        return this.store.save(Object.assign(address, data));
    }

    @Put('/:id')
    @Authorized()
    @OnNull(404)
    @ResponseSchema(Address)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() data: Address
    ) {
        const address = await this.store.findOne({
            where: {
                ownership: AddressOwner.Buyer,
                id,
                createdBy: { id: user.id }
            }
        });
        return address && this.store.save({ ...data, id, updatedBy: user });
    }

    @Get('/:id')
    @Authorized()
    @OnNull(404)
    @ResponseSchema(Address)
    getOne(@Param('id') id: number, @CurrentUser() user: User) {
        return this.store.findOne({
            where: {
                ownership: AddressOwner.Buyer,
                id,
                createdBy: { id: user.id }
            }
        });
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number, @CurrentUser() user: User) {
        const address = await this.store.findOne({
            where: {
                ownership: AddressOwner.Buyer,
                id,
                createdBy: { id: user.id }
            }
        });

        if (!address) throw new NotFoundError();

        await this.store.delete(id);
    }

    @Get()
    @Authorized()
    @ResponseSchema(AddressListChunk)
    async getList(
        @CurrentUser() { id }: User,
        @QueryParams() { pageSize, pageIndex }: BaseFilter
    ) {
        const [list, count] = await this.store.findAndCount({
            where: {
                ownership: AddressOwner.Buyer,
                createdBy: { id }
            },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}

@JsonController('/address')
export class SellerAddressController {
    store = dataSource.getRepository(Address);

    @Post()
    @Authorized([Role.Administrator, Role.Manager])
    @ResponseSchema(Address)
    createOne(@CurrentUser() user: User, @Body() data: Address) {
        const address = new Address();

        address.createdBy = user;

        return this.store.save(Object.assign(address, data));
    }

    @Put('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @OnNull(404)
    @ResponseSchema(Address)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() data: Address
    ) {
        const address = await this.store.findOne({
            where: { ownership: AddressOwner.Seller, id }
        });
        return address && this.store.save({ ...data, id, updatedBy: user });
    }

    @Get('/:id')
    @Authorized()
    @OnNull(404)
    @ResponseSchema(Address)
    getOne(@Param('id') id: number) {
        return this.store.findOne({
            where: { ownership: AddressOwner.Seller, id }
        });
    }

    @Delete('/:id')
    @Authorized([Role.Administrator, Role.Manager])
    @OnUndefined(204)
    async deleteOne(@Param('id') id: number, @CurrentUser() user: User) {
        const address = await this.store.findOne({
            where: { ownership: AddressOwner.Seller, id }
        });

        if (!address) throw new NotFoundError();

        await this.store.delete(id);
    }

    @Get()
    @Authorized()
    @ResponseSchema(AddressListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: BaseFilter) {
        const [list, count] = await this.store.findAndCount({
            where: { ownership: AddressOwner.Seller },
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
