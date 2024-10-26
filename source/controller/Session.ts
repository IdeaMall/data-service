import { JsonWebTokenError, sign } from 'jsonwebtoken';
import { intersection } from 'lodash';
import {
    Authorized,
    Body,
    CurrentUser,
    ForbiddenError,
    Get,
    HttpCode,
    JsonController,
    OnUndefined,
    Post
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

import {
    Captcha,
    JWTAction,
    Role,
    SMSCodeInput,
    SignInData,
    User,
    dataSource
} from '../model';
import { APP_SECRET, leanClient } from '../utility';
import { UserController } from './User';

const store = dataSource.getRepository(User);

@JsonController('/user/session')
export class SessionController {
    static signToken(user: User) {
        return { ...user, token: sign({ ...user }, APP_SECRET) };
    }

    static async getSession(
        { context: { state } }: JWTAction,
        roles: Role[] = []
    ) {
        if (state instanceof JsonWebTokenError) return console.error(state);

        const { user } = state;

        if (!user) return;

        const session = await store.findOneBy({ id: user.id });

        if (!session) return;

        if (roles.length && !intersection(roles, session.roles).length)
            throw new ForbiddenError();

        return session;
    }

    @Get()
    @Authorized()
    @ResponseSchema(User)
    getSession(@CurrentUser() user: User) {
        return user;
    }

    @Post('/captcha')
    @ResponseSchema(Captcha)
    async createCaptcha() {
        const { body } =
            await leanClient.get<Record<`captcha_${'token' | 'url'}`, string>>(
                'requestCaptcha'
            );
        return { token: body.captcha_token, link: body.captcha_url };
    }

    static async verifyCaptcha(captcha_token: string, captcha_code: string) {
        const { body } = await leanClient.post<{ validate_token: string }>(
            'verifyCaptcha',
            { captcha_code, captcha_token }
        );
        return { token: body.validate_token };
    }

    @Post('/SMS-code')
    @OnUndefined(201)
    async createSMSCode(
        @Body() { captchaToken, captchaCode, mobilePhone }: SMSCodeInput
    ) {
        if (captchaToken && captchaCode)
            var { token } = await SessionController.verifyCaptcha(
                captchaToken,
                captchaCode
            );
        await leanClient.post<{}>('requestSmsCode', {
            mobilePhoneNumber: mobilePhone,
            validate_token: token
        });
    }

    static verifySMSCode = (mobilePhoneNumber: string, code: string) =>
        leanClient.post<{}>(`verifySmsCode/${code}`, { mobilePhoneNumber });

    @Post()
    @HttpCode(201)
    @ResponseSchema(User)
    async signIn(@Body() { mobilePhone, code }: SignInData): Promise<User> {
        await SessionController.verifySMSCode(mobilePhone, code);

        const user = await UserController.register({ mobilePhone, code });

        return SessionController.signToken(user);
    }
}
