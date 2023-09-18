import { JsonWebTokenError, sign, verify } from 'jsonwebtoken';
import { intersection } from 'lodash';
import {
    Authorized,
    Body,
    CurrentUser,
    ForbiddenError,
    Get,
    HeaderParam,
    JsonController,
    Post
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import {
    AuthingSession,
    JWTAction,
    Role,
    SignInData,
    User,
    dataSource
} from '../model';
import { AUTHING_APP_SECRET } from '../utility';
import { UserController } from './User';

@JsonController('/user/session')
export class SessionController {
    store = dataSource.getRepository(User);

    static getAuthingUser(token: string): AuthingSession {
        var { phone_number, ...session } = verify(
            token.split(/\s+/)[1],
            AUTHING_APP_SECRET
        ) as AuthingSession;

        if (phone_number && !phone_number.startsWith('+86'))
            phone_number = '+86' + phone_number;

        return { ...session, phone_number };
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

        if (roles.length && !intersection(roles, session.roles).length)
            throw new ForbiddenError();

        return session;
    }

    signToken(user: User) {
        return { ...user, token: sign({ ...user }, AUTHING_APP_SECRET) };
    }

    @Get()
    @Authorized()
    @ResponseSchema(User)
    getSession(@CurrentUser() user: User) {
        return user;
    }

    @Post('/authing')
    @ResponseSchema(User)
    async signInAuthing(
        @HeaderParam('Authorization', { required: true }) token: string
    ) {
        const {
            phone_number: mobilePhone,
            nickname,
            picture
        } = SessionController.getAuthingUser(token);

        const existed = await this.store.findOne({ where: { mobilePhone } });

        const registered = await UserController.register(this.store, {
            ...existed,
            mobilePhone,
            nickName: nickname,
            avatar: picture
        });
        return this.signToken(registered);
    }

    @Post()
    @ResponseSchema(User)
    async signIn(@Body() { mobilePhone, password }: SignInData): Promise<User> {
        const user = await this.store.findOne({
            where: {
                mobilePhone,
                password: UserController.encrypt(password)
            }
        });
        if (!user) throw new ForbiddenError();

        return this.signToken(user);
    }
}
