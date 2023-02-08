import {
    Role,
    UserFilter,
    UserInput,
    UserListChunk,
    UserOutput
} from '@ideamall/data-model';
import { AuthenticationClient } from 'authing-js-sdk';
import { createHash } from 'crypto';
import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { intersection } from 'lodash';
import {
    Authorized,
    Body,
    CurrentUser,
    Delete,
    ForbiddenError,
    Get,
    HeaderParam,
    JsonController,
    OnNull,
    OnUndefined,
    Param,
    Post,
    Put,
    QueryParams,
    UnauthorizedError
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import dataSource, { JWTAction, SignInData, User } from '../model';

const { APP_SECRET, AUTHING_APP_HOST, AUTHING_APP_ID } = process.env;

@JsonController('/user')
export class UserController {
    store = dataSource.getRepository(User);

    static encrypt(raw: string) {
        return createHash('sha1')
            .update(APP_SECRET + raw)
            .digest('hex');
    }

    static async getAuthingUser(token: string) {
        var [type, token] = token.split(/\s+/);

        const authing = new AuthenticationClient({
            appHost: AUTHING_APP_HOST,
            appId: AUTHING_APP_ID,
            token
        });
        const user = await authing.getCurrentUser();

        if (!user) throw new UnauthorizedError();

        return user;
    }

    static async getSession(
        { context: { state, request } }: JWTAction,
        roles: Role[] = []
    ): Promise<UserOutput> {
        if (!(state instanceof JsonWebTokenError)) return state.user;

        const authingUser = await this.getAuthingUser(
            request.get('Authorization')
        );
        const user = await dataSource
            .getRepository(User)
            .findOne({ where: { mobilePhone: authingUser.phone } });

        if (!user) throw new UnauthorizedError();

        if (!intersection(roles, user.roles).length) throw new ForbiddenError();

        return user;
    }

    @Get('/session')
    @Authorized()
    @ResponseSchema(UserOutput)
    getSession(@CurrentUser() user: UserOutput) {
        return user;
    }

    @Post('/session/authing')
    @ResponseSchema(UserOutput)
    async signInAuthing(@HeaderParam('Authorization') token: string) {
        const { phone } = await UserController.getAuthingUser(token);

        const user = await this.store.findOne({
            where: { mobilePhone: phone }
        });
        return this.store.save({ id: user?.id, mobilePhone: phone });
    }

    @Post('/session')
    @ResponseSchema(UserOutput)
    async signIn(
        @Body() { mobilePhone, password }: SignInData
    ): Promise<UserOutput> {
        const user = await this.store.findOne({
            where: {
                mobilePhone,
                password: UserController.encrypt(password)
            }
        });
        if (!user) throw new ForbiddenError();

        return { ...user, token: sign({ ...user }, APP_SECRET) };
    }

    @Post()
    @ResponseSchema(UserOutput)
    async signUp(@Body() data: SignInData) {
        const sum = await this.store.count();

        const { password, ...user } = await this.store.save(
            Object.assign(new User(), data, {
                password: UserController.encrypt(data.password),
                roles: [sum ? Role.Client : Role.Root]
            })
        );
        return user;
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(UserOutput)
    updateOne(
        @Param('id') id: number,
        @CurrentUser() { id: ID, roles }: User,
        @Body() data: UserInput
    ) {
        if (!roles.includes(Role.Root) && id !== ID) throw new ForbiddenError();

        return this.store.save({ ...data, id });
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
        if (!roles.includes(Role.Root) && id !== ID) throw new ForbiddenError();

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
