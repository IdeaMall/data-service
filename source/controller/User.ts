import {
    Role,
    UserFilter,
    UserInput,
    UserListChunk,
    UserOutput
} from '@ideamall/data-model';
import { createHash } from 'crypto';
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
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
    QueryParams
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { uniqueID } from 'web-utility';

import dataSource, {
    AuthingSession,
    JWTAction,
    SignInData,
    User
} from '../model';

const { AUTHING_APP_SECRET } = process.env;

@JsonController('/user')
export class UserController {
    store = dataSource.getRepository(User);

    static encrypt(raw: string) {
        return createHash('sha1')
            .update(AUTHING_APP_SECRET + raw)
            .digest('hex');
    }

    static getAuthingUser(token: string) {
        return verify(
            token.split(/\s+/)[1],
            AUTHING_APP_SECRET
        ) as AuthingSession;
    }

    static async getSession(
        { context: { state } }: JWTAction,
        roles: Role[] = []
    ) {
        if (state instanceof JsonWebTokenError) return console.error(state);

        const { user } = state;

        if (!('userpool_id' in user)) return user;

        const session = await dataSource
            .getRepository(User)
            .findOne({ where: { mobilePhone: user.phone_number } });

        if (!session) return;

        if (!intersection(roles, session.roles).length)
            throw new ForbiddenError();

        return session;
    }

    async register(
        data: Partial<Omit<UserInput & UserOutput, 'createdAt' | 'updatedAt'>>
    ) {
        const sum = await this.store.count();

        const { password, ...user } = await this.store.save({
            roles: [!data.id && !sum ? Role.Administrator : Role.Client],
            ...data,
            password: UserController.encrypt(data.password || uniqueID())
        });
        return user as UserOutput;
    }

    signToken(user: UserOutput) {
        return { ...user, token: sign({ ...user }, AUTHING_APP_SECRET) };
    }

    @Get('/session')
    @Authorized()
    @ResponseSchema(UserOutput)
    getSession(@CurrentUser() user: UserOutput) {
        return user;
    }

    @Post('/session/authing')
    @ResponseSchema(UserOutput)
    async signInAuthing(
        @HeaderParam('Authorization', { required: true }) token: string
    ) {
        const {
            phone_number: mobilePhone,
            nickname,
            picture
        } = UserController.getAuthingUser(token);

        const existed = await this.store.findOne({ where: { mobilePhone } });

        const registered = await this.register({
            ...existed,
            mobilePhone,
            nickName: nickname,
            avatar: picture
        });
        return this.signToken(registered);
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

        return this.signToken(user);
    }

    @Post()
    @ResponseSchema(UserOutput)
    signUp(@Body() data: SignInData) {
        return this.register(data);
    }

    @Put('/:id')
    @Authorized()
    @ResponseSchema(UserOutput)
    updateOne(
        @Param('id') id: number,
        @CurrentUser() { id: ID, roles }: User,
        @Body() data: UserInput
    ) {
        if (!roles.includes(Role.Administrator) && id !== ID)
            throw new ForbiddenError();

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
