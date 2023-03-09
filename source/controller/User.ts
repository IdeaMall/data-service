import {
    Role,
    UserFilter,
    UserInput,
    UserListChunk,
    UserOutput
} from '@ideamall/data-model';
import { createHash } from 'crypto';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    ForbiddenError,
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
import { Repository } from 'typeorm';
import { uniqueID } from 'web-utility';

import dataSource, { SignInData, User } from '../model';

const { AUTHING_APP_SECRET } = process.env;

@JsonController('/user')
export class UserController {
    store = dataSource.getRepository(User);

    static encrypt(raw: string) {
        return createHash('sha1')
            .update(AUTHING_APP_SECRET + raw)
            .digest('hex');
    }

    static async register(
        store: Repository<User>,
        data: Partial<Omit<UserInput & UserOutput, 'createdAt' | 'updatedAt'>>
    ) {
        const sum = await store.count();

        const { id } = await store.save({
            roles: [!data.id && !sum ? Role.Administrator : Role.Client],
            ...data,
            password: UserController.encrypt(data.password || uniqueID())
        });
        return store.findOne({ where: { id } });
    }

    @Post()
    @ResponseSchema(UserOutput)
    signUp(@Body() data: SignInData) {
        return UserController.register(this.store, data);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(UserOutput)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() session: User,
        @Body() { roles, ...data }: UserInput
    ) {
        if (!roles?.length) {
            if (id !== session.id) throw new ForbiddenError();

            return this.store.save({ ...data, id });
        }

        if (!session.roles?.includes(Role.Administrator))
            throw new ForbiddenError();

        await this.store.save({ id, roles });

        return { ...data, roles };
    }

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(UserOutput)
    getOne(@Param('id') id: number) {
        return this.store.findOne({ where: { id } });
    }

    @Delete('/:id')
    @Authorized()
    @OnUndefined(204)
    async deleteOne(
        @Param('id') id: number,
        @CurrentUser() { id: ID, roles }: User
    ) {
        if (!roles.includes(Role.Administrator) && id !== ID)
            throw new ForbiddenError();

        await this.store.delete(id);
    }

    @Get()
    @ResponseSchema(UserListChunk)
    async getList(@QueryParams() { pageSize, pageIndex }: UserFilter) {
        const [list, count] = await this.store.findAndCount({
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
