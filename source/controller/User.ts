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
import { Like } from 'typeorm';
import { uniqueID } from 'web-utility';

import {
    dataSource,
    Role,
    SignInData,
    User,
    UserFilter,
    UserListChunk
} from '../model';
import { APP_SECRET, searchConditionOf } from '../utility';
import { ActivityLogController } from './ActivityLog';
import { SessionController } from './Session';

const store = dataSource.getRepository(User);

@JsonController('/user')
export class UserController {
    static encrypt = (raw: string) =>
        createHash('sha1')
            .update(APP_SECRET + raw)
            .digest('hex');

    static async register(data: SignInData) {
        const existed = await store.findOneBy({
            mobilePhone: Like(`%${data.mobilePhone}`)
        });

        if (existed) return existed;

        const sum = await store.count();

        const saved = await store.save({
            roles: [!sum ? Role.Administrator : Role.Client],
            ...data,
            password: UserController.encrypt(data.password || uniqueID())
        });
        await ActivityLogController.logCreate(saved, 'User', saved.id);

        return saved;
    }

    @Post()
    @ResponseSchema(User)
    signUp(@Body() data: SignInData) {
        return UserController.register(data);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(User)
    async updateOne(
        @Param('id') id: number,
        @CurrentUser() session: User,
        @Body() { roles, ...data }: User
    ) {
        if (
            roles?.length
                ? !session.roles.includes(Role.Administrator)
                : id !== session.id
        )
            throw new ForbiddenError();

        const saved = await store.save({ ...data, roles, id });

        await ActivityLogController.logUpdate(session, 'User', id);

        return SessionController.signToken(saved);
    }

    @Get('/:id')
    @OnNull(404)
    @ResponseSchema(User)
    getOne(@Param('id') id: number) {
        return store.findOneBy({ id });
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

        await store.delete(id);
    }

    @Get()
    @ResponseSchema(UserListChunk)
    async getList(
        @QueryParams() { gender, keywords, pageSize, pageIndex }: UserFilter
    ) {
        const where = searchConditionOf<User>(
            ['mobilePhone', 'nickName'],
            keywords,
            gender && { gender }
        );
        const [list, count] = await store.findAndCount({
            where,
            skip: pageSize * (pageIndex - 1),
            take: pageSize
        });
        return { list, count };
    }
}
