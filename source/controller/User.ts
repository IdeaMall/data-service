import { createHash } from 'crypto';
import {
    JsonController,
    Get,
    Post,
    Authorized,
    CurrentUser,
    Body,
    ForbiddenError
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { JsonWebTokenError, sign } from 'jsonwebtoken';

import { JWTAction, SignInData, SignUpData, UserModel, User } from '../model';
import { Controller } from './Base';

const { APP_SECRET } = process.env;

@JsonController('/user')
export class UserController extends Controller('/user', UserModel, User) {
    static encrypt(raw: string) {
        return createHash('sha1')
            .update(APP_SECRET + raw)
            .digest('hex');
    }

    static getSession({ context: { state } }: JWTAction) {
        return state instanceof JsonWebTokenError
            ? console.error(state)
            : state.user;
    }

    @Get('/session')
    @Authorized()
    @ResponseSchema(UserModel)
    getSession(@CurrentUser() user: UserModel) {
        return user;
    }

    @Post('/session')
    @ResponseSchema(UserModel)
    async signIn(@Body() { email, password }: SignInData): Promise<UserModel> {
        const user = await this.store.findOne({
            where: {
                email,
                password: UserController.encrypt(password)
            }
        });
        if (!user) throw new ForbiddenError();

        return { ...user, token: sign({ ...user }, APP_SECRET) };
    }

    @Post()
    @ResponseSchema(UserModel)
    async signUp(@Body() data: SignUpData) {
        const { password, ...user } = await this.store.save(
            Object.assign(new User(), data, {
                password: UserController.encrypt(data.password)
            })
        );
        return user;
    }
}
